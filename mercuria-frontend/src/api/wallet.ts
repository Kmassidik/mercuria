import { walletClient } from "./client";
import type {
  Wallet,
  WalletEvent,
  CreateWalletRequest,
  DepositRequest,
  WithdrawRequest,
} from "@/types";

interface WalletsResponse {
  wallets: Wallet[];
  total: number;
}

interface WalletResponse {
  wallet: Wallet;
}

interface EventsResponse {
  events: WalletEvent[];
  total: number;
}

export const walletApi = {
  getMyWallets: () =>
    walletClient
      .get<WalletsResponse>("/api/v1/wallets/my-wallets")
      .then((r) => r.data),

  getWallet: (id: string) =>
    walletClient
      .get<WalletResponse>(`/api/v1/wallets/${id}`)
      .then((r) => r.data),

  createWallet: (data: CreateWalletRequest) =>
    walletClient
      .post<WalletResponse>("/api/v1/wallets", data)
      .then((r) => r.data),

  deposit: (walletId: string, data: DepositRequest) =>
    walletClient
      .post<WalletResponse>(`/api/v1/wallets/${walletId}/deposit`, data)
      .then((r) => r.data),

  withdraw: (walletId: string, data: WithdrawRequest) =>
    walletClient
      .post<WalletResponse>(`/api/v1/wallets/${walletId}/withdraw`, data)
      .then((r) => r.data),

  getEvents: (walletId: string, limit = 50, offset = 0) =>
    walletClient
      .get<EventsResponse>(`/api/v1/wallets/${walletId}/events`, {
        params: { limit, offset },
      })
      .then((r) => r.data),
};
