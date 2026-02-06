export interface DailyMetric {
  id: number;
  metric_date: string;
  total_transactions: number;
  total_volume: number;
  total_fees: number;
  unique_users: number;
  successful_transactions: number;
  failed_transactions: number;
  avg_transaction_value: number;
}

export interface HourlyMetric {
  id: number;
  metric_hour: string;
  total_transactions: number;
  total_volume: number;
  total_fees: number;
  unique_users: number;
  successful_transactions: number;
  failed_transactions: number;
  avg_transaction_value: number;
  max_transaction_value: number;
  min_transaction_value: number;
  avg_processing_time_ms: number;
}

export interface MetricsSummary {
  period: string;
  total_transactions: number;
  total_volume: number;
  total_fees: number;
  unique_users: number;
  success_rate: number;
  avg_transaction_size: number;
}

export interface UserAnalytics {
  user_id: string;
  period: string;
  total_sent: number;
  total_received: number;
  net_amount: number;
  transaction_count: number;
  total_fees_paid: number;
  last_transaction_at?: string;
}

export interface UserSnapshot {
  id: number;
  user_id: string;
  snapshot_date: string;
  total_sent: number;
  total_received: number;
  transaction_count: number;
  sent_count: number;
  received_count: number;
  total_fees_paid: number;
  last_transaction_at?: string;
}
