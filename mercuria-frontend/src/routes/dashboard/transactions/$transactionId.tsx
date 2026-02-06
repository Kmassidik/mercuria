import { createFileRoute, Link } from "@tanstack/react-router";
import { useTransaction } from "@/hooks";
import { formatCurrency, formatDateTime, truncateId } from "@/utils/format";
import { TRANSACTION_STATUSES } from "@/utils/constants";
import { ArrowLeft, Loader2, Copy, Check, Receipt } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/transactions/$transactionId")({
  component: TransactionDetailPage,
});

function TransactionDetailPage() {
  const { transactionId } = Route.useParams();
  const { data, isLoading } = useTransaction(transactionId);
  const [copied, setCopied] = useState<string | null>(null);

  const tx = data?.transaction;

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-black" />
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="text-center py-12 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-xl font-black uppercase text-gray-400 mb-6">
          Transaction Not Found
        </p>
        <Link
          to="/dashboard/transactions"
          className="inline-block bg-black text-white px-6 py-3 font-bold uppercase hover:bg-[#FFD93D] hover:text-black border-2 border-transparent hover:border-black transition-all"
        >
          Return to List
        </Link>
      </div>
    );
  }

  const status =
    TRANSACTION_STATUSES[tx.status as keyof typeof TRANSACTION_STATUSES];

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans text-black">
      <Link
        to="/dashboard/transactions"
        className="inline-flex items-center gap-2 font-bold text-gray-500 hover:text-black transition-colors uppercase text-sm"
      >
        <ArrowLeft className="w-4 h-4 stroke-[3px]" />
        Back
      </Link>

      <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b-4 border-black bg-gray-50">
          <h1 className="text-xl font-black uppercase tracking-tighter">
            Transaction Receipt
          </h1>
          <span
            className={`px-3 py-1 font-black text-xs uppercase border-2 border-black ${
              status?.color === "success"
                ? "bg-[#4ADE80]"
                : status?.color === "danger"
                  ? "bg-[#FF6B6B] text-white"
                  : status?.color === "warning"
                    ? "bg-[#FFD93D]"
                    : "bg-gray-200"
            }`}
          >
            {status?.label || tx.status}
          </span>
        </div>

        {/* AMOUNT HERO */}
        <div className="text-center py-10 border-b-4 border-black bg-[#A388EE] text-white">
          <p className="text-5xl font-black tracking-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            {formatCurrency(tx.amount, tx.currency)}
          </p>
          <p className="font-bold uppercase tracking-widest mt-2 opacity-80">
            {tx.type} Transfer
          </p>
        </div>

        {/* DETAILS LIST */}
        <div className="p-6 space-y-6">
          {/* IDs */}
          <div className="space-y-4">
            <DetailRow
              label="Transaction ID"
              value={truncateId(tx.id, 20)}
              fullValue={tx.id}
              field="id"
              copyFn={copyToClipboard}
              copied={copied}
            />
            <div className="border-t-2 border-dashed border-gray-300 my-2" />
            <DetailRow
              label="From Wallet"
              value={truncateId(tx.from_wallet_id, 16)}
              fullValue={tx.from_wallet_id}
              field="from"
              copyFn={copyToClipboard}
              copied={copied}
            />
            <DetailRow
              label="To Wallet"
              value={truncateId(tx.to_wallet_id, 16)}
              fullValue={tx.to_wallet_id}
              field="to"
              copyFn={copyToClipboard}
              copied={copied}
            />
          </div>

          <div className="border-t-4 border-black" />

          {/* METADATA */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <dt className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                Created At
              </dt>
              <dd className="font-bold">{formatDateTime(tx.created_at)}</dd>
            </div>
            {tx.description && (
              <div>
                <dt className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                  Description
                </dt>
                <dd className="font-bold italic">"{tx.description}"</dd>
              </div>
            )}
          </div>

          {tx.failure_reason && (
            <div className="p-4 bg-[#FF6B6B] border-2 border-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <dt className="text-xs font-black uppercase tracking-widest mb-1 opacity-80">
                Error
              </dt>
              <dd className="font-bold">{tx.failure_reason}</dd>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Component for consistency
function DetailRow({ label, value, fullValue, field, copyFn, copied }: any) {
  return (
    <div className="flex justify-between items-center">
      <dt className="font-bold text-gray-500 uppercase text-sm">{label}</dt>
      <dd className="flex items-center gap-3">
        <span className="font-mono font-bold bg-gray-100 px-2 py-1 border border-black text-sm">
          {value}
        </span>
        <button
          onClick={() => copyFn(fullValue, field)}
          className="text-black hover:bg-black hover:text-white p-1 transition-colors border border-transparent hover:border-black rounded-sm"
        >
          {copied === field ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </dd>
    </div>
  );
}
