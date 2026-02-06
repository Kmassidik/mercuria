export const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
] as const;

export const WALLET_STATUSES = {
  active: { label: "Active", color: "success" },
  locked: { label: "Locked", color: "danger" },
  inactive: { label: "Inactive", color: "default" },
} as const;

export const TRANSACTION_STATUSES = {
  pending: { label: "Pending", color: "warning" },
  completed: { label: "Completed", color: "success" },
  failed: { label: "Failed", color: "danger" },
  scheduled: { label: "Scheduled", color: "info" },
  cancelled: { label: "Cancelled", color: "default" },
} as const;

export const TRANSACTION_TYPES = {
  p2p: { label: "P2P Transfer", icon: "ArrowLeftRight" },
  batch: { label: "Batch Transfer", icon: "Layers" },
  scheduled: { label: "Scheduled", icon: "Clock" },
} as const;
