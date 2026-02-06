import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useWallets, useTransactions } from "@/hooks";
import { formatCurrency, formatRelativeTime, truncateId } from "@/utils/format";
import { TRANSACTION_STATUSES } from "@/utils/constants";
import { ArrowLeftRight, Plus, Loader2, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/dashboard/transactions/")({
  component: TransactionsIndexPage,
});

function TransactionsIndexPage() {
  const { data: walletsData, isLoading: walletsLoading } = useWallets();
  const wallets = walletsData?.wallets || [];

  // Default to first wallet if available
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const walletId = selectedWallet || wallets[0]?.id || "";

  const { data: txData, isLoading: txLoading } = useTransactions(walletId);
  const transactions = txData?.transactions || [];

  const isLoading = walletsLoading || txLoading;

  return (
    <div className="space-y-8 font-sans text-black">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">
            Transactions
          </h1>
          <p className="text-lg font-bold text-gray-500 mt-1">
            Track flow of funds across your empire.
          </p>
        </div>
        <Link
          to="/dashboard/transactions/new"
          className="flex items-center gap-2 bg-[#FFD93D] text-black border-2 border-black px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0 active:shadow-none"
        >
          <Plus className="w-5 h-5 stroke-[3px]" />
          New Transfer
        </Link>
      </div>

      {/* FILTER & LIST CONTAINER */}
      <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* WALLET SELECTOR */}
        <div className="mb-6">
          <label className="block text-xs font-black uppercase tracking-widest mb-2">
            Filter by Wallet
          </label>
          <div className="relative max-w-sm">
            <select
              value={selectedWallet}
              onChange={(e) => setSelectedWallet(e.target.value)}
              className="w-full appearance-none border-2 border-black bg-gray-50 p-3 pr-8 font-bold outline-none focus:bg-[#FFFDF8] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer disabled:opacity-50"
              disabled={walletsLoading || wallets.length === 0}
            >
              {wallets.length === 0 && <option>No wallets found</option>}
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.currency} VAULT — {formatCurrency(w.balance, w.currency)}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </div>
          </div>
        </div>

        {/* CONTENT STATE */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-black" />
          </div>
        ) : wallets.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 bg-gray-50">
            <ArrowLeftRight className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-bold text-gray-400 uppercase mb-6">
              Create a wallet to start trading
            </p>
            <Link
              to="/dashboard/wallets/new"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 font-bold uppercase hover:bg-[#A388EE] hover:text-black border-2 border-transparent hover:border-black transition-all"
            >
              Initialize Wallet
            </Link>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 bg-gray-50">
            <ArrowLeftRight className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-bold text-gray-400 uppercase mb-6">
              No transactions found
            </p>
            <Link
              to="/dashboard/transactions/new"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 font-bold uppercase hover:bg-[#A388EE] hover:text-black border-2 border-transparent hover:border-black transition-all"
            >
              Make First Transfer
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto border-2 border-black">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-white uppercase text-sm border-b-2 border-black">
                  <th className="py-4 px-4 font-black tracking-wider">ID</th>
                  <th className="py-4 px-4 font-black tracking-wider">Type</th>
                  <th className="py-4 px-4 font-black tracking-wider">
                    Amount
                  </th>
                  <th className="py-4 px-4 font-black tracking-wider">
                    Status
                  </th>
                  <th className="py-4 px-4 font-black tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="font-bold text-sm">
                {transactions.map((tx) => {
                  const status =
                    TRANSACTION_STATUSES[
                      tx.status as keyof typeof TRANSACTION_STATUSES
                    ];
                  const isOutgoing = tx.from_wallet_id === walletId;

                  return (
                    <tr
                      key={tx.id}
                      className="border-b-2 border-gray-200 hover:bg-[#FFFDF8] transition-colors group"
                    >
                      <td className="py-4 px-4 font-mono text-xs">
                        <Link
                          to="/dashboard/transactions/$transactionId"
                          params={{ transactionId: tx.id }}
                          className="text-blue-600 underline decoration-2 decoration-transparent group-hover:decoration-blue-600 offset-4 transition-all"
                        >
                          {truncateId(tx.id)}
                        </Link>
                      </td>
                      <td className="py-4 px-4 uppercase">
                        {isOutgoing ? (
                          <span className="flex items-center gap-1 text-[#FF6B6B]">
                            OUT <span className="text-xs">↗</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[#4ADE80]">
                            IN <span className="text-xs">↙</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-base">
                        {isOutgoing ? "-" : "+"}
                        {formatCurrency(tx.amount, tx.currency)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2 py-1 text-[10px] font-black uppercase border-2 border-black ${
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
                      </td>
                      <td className="py-4 px-4 text-gray-500 uppercase text-xs">
                        {formatRelativeTime(tx.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
