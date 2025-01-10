import type { ICurrency } from './interfaces/currency.interface';
import { ConfigService } from '@nestjs/config';
export declare class CurrencyService {
    private configService;
    private axiosInstance;
    constructor(configService: ConfigService);
    getCurrencies(): Promise<ICurrency[]>;
    exchangRate(source: string, target: string, sourceAmount: number): Promise<any>;
}
