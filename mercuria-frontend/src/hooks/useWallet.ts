import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletApi } from "@/api";
import type {
  CreateWalletRequest,
  DepositRequest,
  WithdrawRequest,
} from "@/types";

export function useWallets() {
  return useQuery({
    queryKey: ["wallets"],
    queryFn: walletApi.getMyWallets,
  });
}

export function useWallet(id: string) {
  return useQuery({
    queryKey: ["wallet", id],
    queryFn: () => walletApi.getWallet(id),
    enabled: !!id,
  });
}

export function useCreateWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWalletRequest) => walletApi.createWallet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });
}

export function useDeposit(walletId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DepositRequest) => walletApi.deposit(walletId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["wallet", walletId] });
      queryClient.invalidateQueries({ queryKey: ["wallet-events", walletId] });
    },
  });
}

export function useWithdraw(walletId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WithdrawRequest) => walletApi.withdraw(walletId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["wallet", walletId] });
      queryClient.invalidateQueries({ queryKey: ["wallet-events", walletId] });
    },
  });
}

export function useWalletEvents(walletId: string, limit = 50, offset = 0) {
  return useQuery({
    queryKey: ["wallet-events", walletId, limit, offset],
    queryFn: () => walletApi.getEvents(walletId, limit, offset),
    enabled: !!walletId,
  });
}
