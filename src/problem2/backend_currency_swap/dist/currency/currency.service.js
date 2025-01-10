"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let CurrencyService = class CurrencyService {
    constructor(configService) {
        this.configService = configService;
        const token = this.configService.get('WISE_API_TOKEN');
        const baseURL = this.configService.get('WISE_API_ENDPOINT');
        this.axiosInstance = axios_1.default.create({
            baseURL,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            timeout: 5000,
        });
    }
    async getCurrencies() {
        const blackListCode = ['STD', 'CNH', 'UYW', 'ZWG', 'SLE'];
        try {
            const response = await this.axiosInstance.get('v1/currencies');
            const formatResponse = response.data
                .map((data) => ({
                code: data.code,
                symbol: data.symbol,
                name: data.name,
                supportsDecimals: data.supportsDecimals,
                flag_url: `https://wise.com/web-art/assets/flags/${data.code.toLowerCase()}.svg`,
            }))
                .filter((data) => !blackListCode.includes(data.code));
            return formatResponse;
        }
        catch (error) {
            console.log('🚀 ~ CurrencyService ~ getCurrencies ~ error:', error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                error: 'Failed to fetch currencies from Wise API',
                timestamp: new Date(),
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async exchangRate(source, target, sourceAmount) {
        try {
            const response = await this.axiosInstance.get(`v1/rates?source=${source}&target=${target}`);
            const rate = response.data[0].rate;
            const targetAmount = sourceAmount * rate;
            const formatResponse = {
                ...response.data[0],
                targetAmount,
            };
            return {
                status: common_1.HttpStatus.OK,
                data: formatResponse,
            };
        }
        catch (error) {
            console.log('🚀 ~ CurrencyService ~ exchangRate ~ error:', error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                error: 'Rate(s) not found',
                timestamp: new Date(),
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.CurrencyService = CurrencyService;
exports.CurrencyService = CurrencyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CurrencyService);
//# sourceMappingURL=currency.service.js.map