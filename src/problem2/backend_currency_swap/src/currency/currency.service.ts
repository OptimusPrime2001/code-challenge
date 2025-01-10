import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import type { ICurrency } from './interfaces/currency.interface';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class CurrencyService {
  private axiosInstance;
  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('WISE_API_TOKEN');
    const baseURL = this.configService.get<string>('WISE_API_ENDPOINT');

    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      timeout: 5000,
    });
  }

  async getCurrencies(): Promise<ICurrency[]> {
    const blackListCode = ['STD', 'CNH', 'UYW', 'ZWG', 'SLE'];
    try {
      const response: any = await this.axiosInstance.get('v1/currencies');
      const formatResponse = response.data
        .map((data: any) => ({
          code: data.code,
          symbol: data.symbol,
          name: data.name,
          supportsDecimals: data.supportsDecimals,
          flag_url: `https://wise.com/web-art/assets/flags/${data.code.toLowerCase()}.svg`,
        }))
        .filter((data: any) => !blackListCode.includes(data.code));
      return formatResponse;
    } catch (error) {
      console.log('🚀 ~ CurrencyService ~ getCurrencies ~ error:', error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Failed to fetch currencies from Wise API',
          timestamp: new Date(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async exchangRate(source: string, target: string, sourceAmount: number): Promise<any> {
    try {
      const response: any = await this.axiosInstance.get(
        `v1/rates?source=${source}&target=${target}`,
      );
      const rate = response.data[0].rate;
      const targetAmount = sourceAmount * rate;
      const formatResponse = {
        ...response.data[0],
        targetAmount,
      };
      return {
        status: HttpStatus.OK,
        data: formatResponse,
      };
    } catch (error) {
      console.log('🚀 ~ CurrencyService ~ exchangRate ~ error:', error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Rate(s) not found',
          timestamp: new Date(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
