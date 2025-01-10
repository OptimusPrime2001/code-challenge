import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import type { ExchangeRateDto } from './interfaces/exchange-rate.dto';

@Controller()
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('list-currency')
  async getCurrencies() {
    return await this.currencyService.getCurrencies();
  }
  @Post('exchange-rate')
  async exchangeRate(@Body() exchangeRateDto: ExchangeRateDto) {
    const { sourceAmount, sourceCurrency, targetCurrency } = exchangeRateDto;
    return await this.currencyService.exchangRate(sourceCurrency, targetCurrency, sourceAmount);
  }
}
