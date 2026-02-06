import axios, { type AxiosInstance } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "@/utils/storage";

const API_URLS = {
  auth: import.meta.env.VITE_AUTH_URL || "http://localhost:8080",
  wallet: import.meta.env.VITE_WALLET_URL || "http://localhost:8081",
  transaction: import.meta.env.VITE_TRANSACTION_URL || "http://localhost:8082",
  ledger: import.meta.env.VITE_LEDGER_URL || "http://localhost:8083",
  analytics: import.meta.env.VITE_ANALYTICS_URL || "http://localhost:8084",
};

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function createClient(baseURL: string): AxiosInstance {
  const client = axios.create({ baseURL, timeout: 10000 });

  client.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  client.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      // ✅ FIX 1: Ignore 401s from Login/Register endpoints so they don't trigger a reload
      if (
        originalRequest.url?.includes("/login") ||
        originalRequest.url?.includes("/register")
      ) {
        return Promise.reject(error);
      }

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(client(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        // ✅ FIX 2: Don't reload if we are already on the login page
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_URLS.auth}/api/v1/refresh`, {
          refresh_token: refreshToken,
        });

        setTokens(data.access_token, data.refresh_token);
        refreshQueue.forEach((cb) => cb(data.access_token));
        refreshQueue = [];

        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return client(originalRequest);
      } catch {
        clearTokens();
        // ✅ FIX 3: Same check here
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }
  );

  return client;
}

export const authClient = createClient(API_URLS.auth);
export const walletClient = createClient(API_URLS.wallet);
export const transactionClient = createClient(API_URLS.transaction);
export const ledgerClient = createClient(API_URLS.ledger);
export const analyticsClient = createClient(API_URLS.analytics);
