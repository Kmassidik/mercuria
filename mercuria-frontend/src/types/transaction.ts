export interface Transaction {
  id: string;
  from_wallet_id: string;
  to_wallet_id: string;
  amount: string;
  currency: string;
  type: "p2p" | "batch" | "scheduled";
  status: "pending" | "completed" | "failed" | "scheduled" | "cancelled";
  description?: string;
  idempotency_key: string;
  scheduled_at?: string;
  processed_at?: string;
  failure_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionRequest {
  from_wallet_id: string;
  to_wallet_id: string;
  amount: string;
  description?: string;
  idempotency_key: string;
}

export interface BatchTransferItem {
  to_wallet_id: string;
  amount: string;
  description?: string;
}

export interface CreateBatchTransactionRequest {
  from_wallet_id: string;
  transfers: BatchTransferItem[];
  idempotency_key: string;
}

export interface CreateScheduledTransactionRequest {
  from_wallet_id: string;
  to_wallet_id: string;
  amount: string;
  description?: string;
  scheduled_at: string;
  idempotency_key: string;
}
