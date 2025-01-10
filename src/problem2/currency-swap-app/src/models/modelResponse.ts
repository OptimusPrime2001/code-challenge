export interface ICurrency {
  code: string;
  symbol: string;
  name: string;
  supportsDecimals: boolean;
  flag_url: string;
}
export interface IRateResult {
  rate: number;
  source: string;
  target: string;
  time: string;
  targetAmount: number;
}
