"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const DEFAULT_AXIOS_TIMEOUT = 60 * 1000;
const axiosInstance = axios_1.default.create({
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: `Bearer 222 ${process.env.WISE_API_TOKEN}`,
    },
    baseURL: process.env.WISE_API_ENDPOINT || 'testURL',
    timeout: DEFAULT_AXIOS_TIMEOUT,
});
axiosInstance.interceptors.request.use((config) => {
    console.log('Outgoing Request:', {
        url: config.baseURL,
        method: config.method,
        headers: config.headers,
        data: config.data,
    });
    return config;
}, (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
});
exports.default = axiosInstance;
//# sourceMappingURL=axiosIstance.js.map