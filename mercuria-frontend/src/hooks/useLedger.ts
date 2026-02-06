import { useQuery } from "@tanstack/react-query";
import { ledgerApi } from "@/api";

export function useLedgerEntry(id: string) {
  return useQuery({
    queryKey: ["ledger-entry", id],
    queryFn: () => ledgerApi.getEntry(id),
    enabled: !!id,
  });
}

export function useTransactionLedger(transactionId: string) {
  return useQuery({
    queryKey: ["ledger-transaction", transactionId],
    queryFn: () => ledgerApi.getByTransaction(transactionId),
    enabled: !!transactionId,
  });
}

export function useWalletLedger(walletId: string, limit = 50, offset = 0) {
  return useQuery({
    queryKey: ["ledger-wallet", walletId, limit, offset],
    queryFn: () => ledgerApi.getByWallet(walletId, limit, offset),
    enabled: !!walletId,
  });
}

export function useLedgerStats(walletId: string) {
  return useQuery({
    queryKey: ["ledger-stats", walletId],
    queryFn: () => ledgerApi.getStats(walletId),
    enabled: !!walletId,
  });
}

export function useLedgerEntries(limit = 50, offset = 0) {
  return useQuery({
    queryKey: ["ledger-entries", limit, offset],
    queryFn: () => ledgerApi.getAll(limit, offset),
  });
}
