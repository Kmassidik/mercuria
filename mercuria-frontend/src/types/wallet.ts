export interface Wallet {
  id: string;
  user_id: string;
  currency: string;
  balance: string;
  status: "active" | "locked" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface WalletEvent {
  id: string;
  wallet_id: string;
  event_type: string;
  amount: string;
  balance_before: string;
  balance_after: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface CreateWalletRequest {
  currency: string;
}

export interface DepositRequest {
  amount: string;
  idempotency_key: string;
  description?: string;
}

export interface WithdrawRequest {
  amount: string;
  idempotency_key: string;
  description?: string;
}
