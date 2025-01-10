import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const formatCurrency = (amount: string | number) => {
  if (!amount) return '';
  if (amount.toString().includes('.')) return amount;
  return parseInt(amount.toString(), 10).toLocaleString('vi-VN');
};
export const formattedNumber = (number: string | number) => {
  if (typeof number === 'number') return number;
  return Number(number.replace(/\./g, ''));
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
