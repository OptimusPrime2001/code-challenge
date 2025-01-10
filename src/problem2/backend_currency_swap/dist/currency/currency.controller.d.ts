import { CurrencyService } from './currency.service';
import type { ExchangeRateDto } from './interfaces/exchange-rate.dto';
export declare class CurrencyController {
    private readonly currencyService;
    constructor(currencyService: CurrencyService);
    getCurrencies(): Promise<import("./interfaces/currency.interface").ICurrency[]>;
    exchangeRate(exchangeRateDto: ExchangeRateDto): Promise<any>;
}
