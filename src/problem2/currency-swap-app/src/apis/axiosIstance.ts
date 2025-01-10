import axios from 'axios';

const DEFAULT_AXIOS_TIMEOUT = 60 * 1000;

const API_KEY = import.meta.env.VITE_WISE_API_KEY;
const API_ENDPOINT = import.meta.env.VITE_WISE_API_ENPOINT;
const axiosInstance = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Authorization: `Bearer ${API_KEY}`,
  },

  baseURL: API_ENDPOINT,
  timeout: DEFAULT_AXIOS_TIMEOUT,
});

export default axiosInstance;
