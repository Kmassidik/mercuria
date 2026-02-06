export interface LedgerEntry {
  id: string;
  transaction_id: string;
  wallet_id: string;
  entry_type: "debit" | "credit";
  amount: string;
  currency: string;
  balance: string;
  description?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface LedgerStats {
  wallet_id?: string;
  total_debits: string;
  total_credits: string;
  net_change: string;
  entry_count: number;
  first_entry?: string;
  last_entry?: string;
}
