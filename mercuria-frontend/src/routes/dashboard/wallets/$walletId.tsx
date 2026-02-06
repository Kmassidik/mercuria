import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useWallet, useWalletEvents } from "@/hooks";
import { formatCurrency, formatDateTime, truncateId } from "@/utils/format";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Copy,
  Check,
  History,
} from "lucide-react";
import { DepositModal } from "@/components/DepositModal";
import { WithdrawModal } from "@/components/WithdrawModal";

export const Route = createFileRoute("/dashboard/wallets/$walletId")({
  component: WalletDetailPage,
});

function WalletDetailPage() {
  const { walletId } = Route.useParams();
  const { data: walletData, isLoading: walletLoading } = useWallet(walletId);
  const { data: eventsData, isLoading: eventsLoading } =
    useWalletEvents(walletId);

  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [copied, setCopied] = useState(false);

  const wallet = walletData?.wallet;
  const events = eventsData?.events || [];

  const copyId = async () => {
    await navigator.clipboard.writeText(walletId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (walletLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-black" />
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="text-center py-20 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-2xl font-black uppercase text-gray-400 mb-6">
          Vault Not Found
        </p>
        <Link
          to="/dashboard/wallets"
          className="inline-block bg-black text-white px-8 py-3 font-bold uppercase hover:bg-[#FFD93D] hover:text-black border-2 border-transparent hover:border-black transition-all"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-black">
      <Link
        to="/dashboard/wallets"
        className="inline-flex items-center gap-2 font-bold text-gray-500 hover:text-black transition-colors uppercase text-sm"
      >
        <ArrowLeft className="w-4 h-4 stroke-[3px]" />
        Back to Vaults
      </Link>

      {/* HERO CARD */}
      <div className="border-4 border-black bg-[#FFFDF8] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <span className="text-9xl font-black">{wallet.currency}</span>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-1 bg-black text-white text-xs font-bold uppercase">
                {wallet.currency} VAULT
              </span>
              <div className="flex items-center gap-2 text-gray-500">
                <span className="font-mono text-sm font-bold tracking-tight">
                  {truncateId(walletId, 20)}
                </span>
                <button
                  onClick={copyId}
                  className="hover:text-black transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-[#4ADE80]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-6xl font-black tracking-tighter text-black mt-4">
              {formatCurrency(wallet.balance, wallet.currency)}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowDeposit(true)}
              className="flex items-center gap-2 bg-[#4ADE80] text-black border-2 border-black px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0 active:shadow-none"
            >
              <ArrowDownRight className="w-5 h-5 stroke-[3px]" />
              Deposit
            </button>
            <button
              onClick={() => setShowWithdraw(true)}
              className="flex items-center gap-2 bg-white text-black border-2 border-black px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0 active:shadow-none"
            >
              <ArrowUpRight className="w-5 h-5 stroke-[3px]" />
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVITY FEED */}
      <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2 border-b-4 border-black pb-4 mb-6">
          <History className="w-6 h-6" />
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            Ledger Activity
          </h2>
        </div>

        {eventsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-black" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300">
            <p className="text-xl font-bold text-gray-400 uppercase">
              No records found
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => {
              const isPositive =
                event.event_type.includes("deposit") ||
                event.event_type.includes("credit");
              return (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border-2 border-black bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                        isPositive ? "bg-[#4ADE80]" : "bg-[#FF6B6B]"
                      }`}
                    >
                      {isPositive ? (
                        <ArrowDownRight className="w-5 h-5 text-black" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase tracking-wide">
                        {event.event_type.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs font-bold text-gray-500 uppercase">
                        {formatDateTime(event.created_at)}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-lg font-black ${
                      isPositive ? "text-[#4ADE80]" : "text-[#FF6B6B]"
                    }`}
                  >
                    {isPositive ? "+" : "-"}
                    {formatCurrency(event.amount, wallet.currency)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODALS */}
      <DepositModal
        isOpen={showDeposit}
        onClose={() => setShowDeposit(false)}
        walletId={walletId}
        currency={wallet.currency}
      />

      <WithdrawModal
        isOpen={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        walletId={walletId}
        currency={wallet.currency}
        balance={wallet.balance}
      />
    </div>
  );
}
