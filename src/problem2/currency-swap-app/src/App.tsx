import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import SelectCountryCode from '@components/common/SelectCountryCode';
import IconSwap from '@components/common/IconSwap';
import React from 'react';
import axiosInstance from './apis/axiosIstance';
import { Loader2 } from 'lucide-react';
import type { ICurrency, IRateResult } from './models/modelResponse';
import { formatCurrency, formattedNumber, roundUp, validateValueCurrency } from './lib/utils';
import { Skeleton } from './components/ui/skeleton';
import { Form, FormControl, FormField, FormItem, FormLabel } from './components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type CurrencyCovert = {
  amount: string | number;
  selectedCurrency?: ICurrency;
};
const formSchema = z.object({
  sourceAmount: z.string().min(0, {
    message: 'sourceAmount must be at least 2 characters.',
  }),
  targetAmount: z.string().min(0, {
    message: 'targetAmount must be at least 2 characters.',
  }),
});
function App() {
  //! States
  const [currenciesData, setCurrenciesData] = React.useState<ICurrency[]>([]);
  const [sourceCurrency, setSourceCurrency] = React.useState<CurrencyCovert>({
    amount: '1.000',
  });
  const [targetCurrency, setTargetCurrency] = React.useState<CurrencyCovert>({
    amount: '',
  });
  const [isConverting, setIsConverting] = React.useState<boolean>(false);
  const [rateResult, setRateResult] = React.useState<IRateResult>();

  //! Functions
  const fetchCurrentRate = async () => {
    try {
      const result = await axiosInstance.post('exchange-rate', {
        sourceCurrency: sourceCurrency.selectedCurrency?.code,
        targetCurrency: targetCurrency.selectedCurrency?.code,
        sourceAmount: formattedNumber(sourceCurrency.amount),
      });
      const formatResult: IRateResult = result.data.data;
      setRateResult(formatResult);
      setTargetCurrency((prev) => ({
        ...prev,
        amount: roundUp(formattedNumber(formatResult.targetAmount)),
      }));
    } catch (error) {
      console.debug('🚀 ~ handleConvertCurrency ~ error:', error);
    }
  };
  const handleConvertCurrency = async () => {
    setIsConverting(true);
    fetchCurrentRate();
    setIsConverting(false);
  };
  const handleSelectSourceCurrency = React.useCallback((currency: ICurrency) => {
    setSourceCurrency((prev) => ({
      ...prev,
      selectedCurrency: currency,
    }));
  }, []);
  const handleSelectTargetCurrency = React.useCallback((currency: ICurrency) => {
    setTargetCurrency((prev) => ({
      ...prev,
      selectedCurrency: currency,
    }));
  }, []);
  const handleSwapCurrency = () => {
    setSourceCurrency((prev) => ({
      ...prev,
      selectedCurrency: targetCurrency.selectedCurrency,
    }));
    setTargetCurrency((prev) => ({
      ...prev,
      selectedCurrency: sourceCurrency.selectedCurrency,
    }));
  };

  //! Effects
  React.useEffect(() => {
    const fetchDataCurrencies = async () => {
      try {
        const response = await axiosInstance.get('list-currency');
        const currenciesData: ICurrency[] = response.data;
        setCurrenciesData(currenciesData);
        setSourceCurrency((prev) => ({
          ...prev,
          selectedCurrency: currenciesData.find((data) => data.code === 'EUR'),
        }));
        setTargetCurrency((prev) => ({
          ...prev,
          selectedCurrency: currenciesData.find((data) => data.code === 'USD'),
        }));
      } catch (error) {
        console.debug('Error fetching data: ', error);
      }
    };
    fetchDataCurrencies();
  }, []);
  React.useEffect(() => {
    if (sourceCurrency.selectedCurrency && targetCurrency.selectedCurrency) {
      fetchCurrentRate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceCurrency.selectedCurrency, targetCurrency.selectedCurrency]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceAmount: '',
      targetAmount: '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    handleConvertCurrency();
  }
  //! Return JSX
  return (
    <section className="flex flex-col items-center justify-center w-screen h-screen p-8 bg-green-400">
      <h1 className="text-3xl font-bold">Currency Convert</h1>
      <p className="mt-2 mb-4 text-2xl font-semibold">
        Convert VND to EUR at the real exchange rate
      </p>
      <section className="p-4 bg-white rounded-2xl min-w-[600px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8"></form>
        </Form>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="flex flex-col gap-y-2"
        >
          <h5 className="text-xl font-semibold text-green-500">Swap</h5>
          <Label htmlFor="source-amount">Amount</Label>
          <div className="flex gap-x-2">
            <FormField
              control={form.control}
              name="sourceAmount"
              render={({ field }) => (
                <FormItem className="flex items-center gap-x-2">
                  <FormLabel htmlFor="source-amount">Amount</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="flex-1 font-medium"
                      inputMode="decimal"
                      value={sourceCurrency.amount}
                      onChange={(event) => {
                        const value = event.target.value;
                        setSourceCurrency((prev) => ({
                          ...prev,
                          amount: validateValueCurrency(value),
                        }));
                      }}
                      onBlur={() => {
                        setSourceCurrency((prev) => ({
                          ...prev,
                          amount: formatCurrency(prev.amount),
                        }));
                      }}
                      id="source-amount"
                    />
                  </FormControl>
                  <SelectCountryCode
                    onSelectCurrency={handleSelectSourceCurrency}
                    selectedCurrency={sourceCurrency.selectedCurrency}
                    currenciesData={currenciesData}
                  />
                </FormItem>
              )}
            />

            <SelectCountryCode
              onSelectCurrency={handleSelectSourceCurrency}
              selectedCurrency={sourceCurrency.selectedCurrency}
              currenciesData={currenciesData}
            />
          </div>
          <IconSwap onClick={handleSwapCurrency} className="mx-auto my-2 cursor-pointer" />
          <FormField
            control={form.control}
            name="targetAmount"
            render={({ field }) => (
              <FormItem className="flex items-center gap-x-2">
                <FormLabel htmlFor="target-amount">Converted to</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="flex-1 font-medium"
                    inputMode="decimal"
                    value={sourceCurrency.amount}
                    onChange={(event) => {
                      const value = event.target.value;
                      setSourceCurrency((prev) => ({
                        ...prev,
                        amount: validateValueCurrency(value),
                      }));
                    }}
                    onBlur={() => {
                      setSourceCurrency((prev) => ({
                        ...prev,
                        amount: formatCurrency(prev.amount),
                      }));
                    }}
                    id="target-amount"
                  />
                </FormControl>
                <SelectCountryCode
                  onSelectCurrency={handleSelectTargetCurrency}
                  selectedCurrency={targetCurrency.selectedCurrency}
                  currenciesData={currenciesData}
                />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between mt-3">
            {rateResult ? (
              <p className="text-sm font-semibold">
                {sourceCurrency.selectedCurrency?.symbol} 1.000 {rateResult?.source} ={' '}
                {targetCurrency.selectedCurrency?.symbol} {roundUp(rateResult?.rate * 1000)}{' '}
                {rateResult?.target}{' '}
              </p>
            ) : (
              <Skeleton className="w-[200px] h-6" />
            )}
            <Button type="submit" disabled={isConverting}>
              {isConverting ? (
                <div className="flex items-center gap-x-2">
                  <Loader2 className="animate-spin" />
                  Converting
                </div>
              ) : (
                'Convert'
              )}
            </Button>
          </div>
        </form>
      </section>
    </section>
  );
}

export default App;
