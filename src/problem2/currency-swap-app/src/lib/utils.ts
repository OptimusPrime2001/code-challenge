import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const formatCurrency = (value: string | number, currency: string) => {
  if (!value) return '';
  const formattedValue = new Intl.NumberFormat('en-EN', {
    style: 'decimal',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(roundUp(+value));
  return formattedValue;
};
export const formattedNumber = (number: string | number) => {
  if (typeof number === 'number') return number;
  return parseFloat(number.replace(/[^0-9.-]+/g, ''));
};
export const validateValueCurrency = (value: string) => {
  if (!/^\d*$/.test(value)) {
    return value.replace(/[^\d]/g, '');
  }
  return value;
};
export const roundUp = (number: number, decimals = 2) => {
  const factor = Math.pow(10, decimals);
  return Math.ceil(number * factor) / factor;
};
