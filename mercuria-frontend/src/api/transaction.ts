import { transactionClient } from "./client";
import type {
  Transaction,
  CreateTransactionRequest,
  CreateBatchTransactionRequest,
  CreateScheduledTransactionRequest,
} from "@/types";

interface TransactionResponse {
  transaction: Transaction;
}

interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
}

export const transactionApi = {
  create: (data: CreateTransactionRequest) =>
    transactionClient
      .post<TransactionResponse>("/api/v1/transactions", data)
      .then((r) => r.data),

  createBatch: (data: CreateBatchTransactionRequest) =>
    transactionClient
      .post("/api/v1/transactions/batch", data)
      .then((r) => r.data),

  createScheduled: (data: CreateScheduledTransactionRequest) =>
    transactionClient
      .post<TransactionResponse>("/api/v1/transactions/scheduled", data)
      .then((r) => r.data),

  get: (id: string) =>
    transactionClient
      .get<TransactionResponse>(`/api/v1/transactions/${id}`)
      .then((r) => r.data),

  list: (walletId: string, limit = 50, offset = 0) =>
    transactionClient
      .get<TransactionsResponse>("/api/v1/transactions", {
        params: { wallet_id: walletId, limit, offset },
      })
      .then((r) => r.data),
};
