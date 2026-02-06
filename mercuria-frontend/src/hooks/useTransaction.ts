import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionApi } from "@/api";
import type {
  CreateTransactionRequest,
  CreateBatchTransactionRequest,
  CreateScheduledTransactionRequest,
} from "@/types";

export function useTransactions(walletId: string, limit = 50, offset = 0) {
  return useQuery({
    queryKey: ["transactions", walletId, limit, offset],
    queryFn: () => transactionApi.list(walletId, limit, offset),
    enabled: !!walletId,
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: ["transaction", id],
    queryFn: () => transactionApi.get(id),
    enabled: !!id,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionRequest) => transactionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });
}

export function useCreateBatchTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBatchTransactionRequest) =>
      transactionApi.createBatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });
}

export function useCreateScheduledTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScheduledTransactionRequest) =>
      transactionApi.createScheduled(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
