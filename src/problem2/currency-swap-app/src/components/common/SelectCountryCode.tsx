import React from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { Button } from '@components/ui/button';
import type { ICurrency } from '@/models/modelResponse';
import { ChevronsUpDown } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';
type SelectCountryCodeProps = {
  currenciesData: ICurrency[];
  selectedCurrency?: ICurrency;
  onSelectCurrency: (currentCurrency: ICurrency) => void;
};
const fallbackFlag = 'https://wise.com/web-art/assets/flags/wise.svg';
const SelectCountryCode: React.FC<SelectCountryCodeProps> = React.memo(
  (props: SelectCountryCodeProps) => {
    const { currenciesData, selectedCurrency, onSelectCurrency } = props;
    const [listCurrencyErrorImage, setListCurrencyErrorImage] = React.useState<string[]>([]);
    const [open, setOpen] = React.useState(false);

    if (!selectedCurrency) return <Skeleton className="w-[140px] h-[45px] rounded-md" />;
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant={'outline'} className="">
            <div className="w-4 h-4">
              <img className="block w-4 h-4" src={selectedCurrency.flag_url} />
            </div>
            <span>{selectedCurrency.code}</span>
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 max-w-[300px]" side="right" align="start">
          <Command>
            <CommandInput placeholder="Search country code..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {currenciesData?.map((currency) => (
                  <CommandItem
                    className={cn(
                      'flex items-center border border-transparent cursor-pointer hover:border-slate-200 gap-x-2',
                      selectedCurrency.code === currency.code ? 'border-slate-200 bg-accent' : '',
                    )}
                    key={currency.code}
                    value={currency.code}
                    onSelect={(value) => {
                      const selectedCurrency = currenciesData.find(
                        (currency) => currency.code === value,
                      );
                      const flag_img = listCurrencyErrorImage.includes(currency.code)
                        ? fallbackFlag
                        : currency.flag_url;
                      onSelectCurrency({
                        ...selectedCurrency,
                        flag_url: flag_img,
                      } as ICurrency);
                      setOpen(false);
                    }}
                  >
                    <img
                      onError={() => {
                        setListCurrencyErrorImage((prev) => [...prev, currency.code]);
                      }}
                      className="w-5 h-5"
                      src={
                        listCurrencyErrorImage.includes(currency.code)
                          ? fallbackFlag
                          : currency.flag_url
                      }
                    />
                    {currency.code}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

export default SelectCountryCode;
