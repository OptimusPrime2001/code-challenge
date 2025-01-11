import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import SelectCountryCode from '@components/common/SelectCountryCode';
import IconSwap from '@components/common/IconSwap';
import React from 'react';
import axiosInstance from './apis/axiosIstance';
import { Loader2 } from 'lucide-react';
import type { ICurrency, IRateResult } from './models/modelResponse';
import { cn, formatCurrency, formattedNumber, validateValueCurrency } from './lib/utils';
import { Skeleton } from './components/ui/skeleton';
import { defatulSourceCurrency, defaultTargetCurrency } from './lib/constants';
import { useToast } from './hooks/use-toast';

type CurrencyCovert = {
  amount: string | number;
  selectedCurrency: ICurrency;
};

function App() {
  //! States
  const [currenciesData, setCurrenciesData] = React.useState<ICurrency[]>([]);
  const [sourceCurrency, setSourceCurrency] = React.useState<CurrencyCovert>(defatulSourceCurrency);
  const [targetCurrency, setTargetCurrency] = React.useState<CurrencyCovert>(defaultTargetCurrency);
  const [isConverting, setIsConverting] = React.useState<boolean>(false);
  const [exchangeRateResult, setExchangeRateResult] = React.useState<IRateResult>();
  const { toast } = useToast();
  //! Functions
  const fetchExchangeRate = async (sourceCode?: string, targetCode?: string) => {
    try {
      const result = await axiosInstance.post('exchange-rate', {
        sourceCurrency: sourceCode || sourceCurrency.selectedCurrency?.code,
        targetCurrency: targetCode || targetCurrency.selectedCurrency?.code,
        sourceAmount: formattedNumber(sourceCurrency.amount),
      });
      const rateData: IRateResult = result.data.data;
      setExchangeRateResult(rateData);
      setTargetCurrency((prev) => ({
        ...prev,
        amount: formatCurrency(rateData.targetAmount, prev.selectedCurrency.code),
      }));
    } catch (error) {
      console.debug('🚀 ~ fetchExchangeRate ~ error:', error);
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request, change the currency for continute.',
      });
    }
  };
  const handleConvertCurrency = async () => {
    setIsConverting(true);
    await fetchExchangeRate();
    setIsConverting(false);
  };
  const handleSelectSourceCurrency = React.useCallback((currency: ICurrency) => {
    setSourceCurrency((prev) => ({
      ...prev,
      selectedCurrency: currency,
    }));
    setTargetCurrency((prev) => ({
      ...prev,
      amount: '',
    }));
    setExchangeRateResult(undefined);
  }, []);
  const handleSelectTargetCurrency = React.useCallback((currency: ICurrency) => {
    setTargetCurrency({
      amount: '',
      selectedCurrency: currency,
    });

    setExchangeRateResult(undefined);
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
    fetchExchangeRate(targetCurrency.selectedCurrency.code, sourceCurrency.selectedCurrency.code);
  };

  //! Effects
  React.useEffect(() => {
    const fetchDataCurrencies = async () => {
      try {
        const response = await axiosInstance.get('list-currency');
        const currenciesData: ICurrency[] = response.data;
        setCurrenciesData(currenciesData);
      } catch (error) {
        console.debug('🚀 ~ fetchDataCurrencies ~ error:', error);
        toast({
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
        });
      }
    };
    fetchDataCurrencies();
    fetchExchangeRate();
  }, []);

  //! Return JSX
  return (
    <section className="flex flex-col items-center justify-center w-screen h-screen p-8 bg-blue-100">
      <h1 className="text-3xl font-bold text-blue-500 md:text-4xl">Currency Convert</h1>
      <p className="mt-2 mb-4 text-xl font-bold text-center text-blue-500 md:text-2xl">
        Convert {sourceCurrency.selectedCurrency?.code} to {targetCurrency.selectedCurrency?.code}{' '}
        at the real exchange rate
      </p>
      <section className="p-6 bg-white shadow-md rounded-2xl ">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleConvertCurrency();
          }}
        >
          <div className="flex flex-col items-center md:flex-row gap-x-4 gap-y-2">
            <div>
              <Label htmlFor="source-amount">Amount</Label>
              <div className="flex gap-x-2">
                <Input
                  className="flex-1 font-medium"
                  inputMode="decimal"
                  value={sourceCurrency.amount}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSourceCurrency((prev) => ({
                      ...prev,
                      amount: validateValueCurrency(value),
                    }));
                    setTargetCurrency((prev) => ({
                      ...prev,
                      amount: '',
                    }));
                  }}
                  onBlur={() => {
                    setSourceCurrency((prev) => ({
                      ...prev,
                      amount: formatCurrency(prev.amount, prev.selectedCurrency.code),
                    }));
                  }}
                  id="source-amount"
                />
                <SelectCountryCode
                  onSelectCurrency={handleSelectSourceCurrency}
                  selectedCurrency={sourceCurrency.selectedCurrency}
                  currenciesData={currenciesData}
                />
              </div>
            </div>
            <IconSwap
              onClick={handleSwapCurrency}
              className="p-3 mx-4 my-2 border rounded-full cursor-pointer hover:bg-slate-100"
            />
            <div>
              <Label htmlFor="target-amount">Converted to</Label>
              <div className="flex items-center gap-x-2">
                <Input
                  disabled
                  className="flex-1 font-medium"
                  inputMode="decimal"
                  value={targetCurrency.amount}
                  onChange={(event) => {
                    const value = event.target.value;
                    setTargetCurrency((prev) => ({
                      ...prev,
                      amount: validateValueCurrency(value),
                    }));
                  }}
                  onBlur={() => {
                    setTargetCurrency((prev) => ({
                      ...prev,
                      amount: prev.amount,
                    }));
                  }}
                  id="target-amount"
                />
                <SelectCountryCode
                  onSelectCurrency={handleSelectTargetCurrency}
                  selectedCurrency={targetCurrency.selectedCurrency}
                  currenciesData={currenciesData}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse items-center justify-between gap-3 mt-4 md:flex-row ">
            {!isConverting ? (
              <p
                className={cn(
                  'text-sm font-semibold',
                  exchangeRateResult ? 'visible' : 'invisible',
                )}
              >
                {sourceCurrency.selectedCurrency?.symbol} 1.000 {exchangeRateResult?.source} ={' '}
                {targetCurrency.selectedCurrency?.symbol}{' '}
                {formatCurrency(
                  (exchangeRateResult?.rate || 0) * 1000,
                  exchangeRateResult?.target || 'USD',
                )}{' '}
                {exchangeRateResult?.target}{' '}
              </p>
            ) : (
              <Skeleton className="w-[200px] h-6" />
            )}
            <Button
              className="w-full bg-blue-500 rounded-full hover:bg-blue-400 md:w-fit"
              type="submit"
              disabled={isConverting}
            >
              {isConverting ? (
                <div className="flex items-center gap-x-2">
                  <Loader2 className="animate-spin" />
                  Converting
                </div>
              ) : (
                'Convert amount'
              )}
            </Button>
          </div>
        </form>
      </section>
    </section>
  );
}

export default App;
