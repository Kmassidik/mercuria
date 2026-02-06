import { ledgerClient } from "./client";
import type { LedgerEntry, LedgerStats } from "@/types";

interface EntriesResponse {
  entries: LedgerEntry[];
  total: number;
}

interface WalletLedgerResponse {
  entries: LedgerEntry[];
  current_balance: string;
}

export const ledgerApi = {
  getEntry: (id: string) =>
    ledgerClient.get<LedgerEntry>(`/api/v1/ledger/${id}`).then((r) => r.data),

  getByTransaction: (transactionId: string) =>
    ledgerClient
      .get<EntriesResponse>(`/api/v1/ledger/transaction/${transactionId}`)
      .then((r) => r.data),

  getByWallet: (walletId: string, limit = 50, offset = 0) =>
    ledgerClient
      .get<WalletLedgerResponse>("/api/v1/ledger/wallet", {
        params: { wallet_id: walletId, limit, offset },
      })
      .then((r) => r.data),

  getStats: (walletId: string) =>
    ledgerClient
      .get<LedgerStats>("/api/v1/ledger/stats", {
        params: { wallet_id: walletId },
      })
      .then((r) => r.data),

  getAll: (limit = 50, offset = 0) =>
    ledgerClient
      .get<EntriesResponse>("/api/v1/ledger", { params: { limit, offset } })
      .then((r) => r.data),
};
