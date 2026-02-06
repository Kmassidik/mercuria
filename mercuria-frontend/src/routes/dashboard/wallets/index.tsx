import { createFileRoute, Link } from "@tanstack/react-router";
import { useWallets } from "@/hooks";
import { formatCurrency, formatDate } from "@/utils/format";
import { Wallet, Plus, Loader2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/dashboard/wallets/")({
  component: WalletsPage,
});

function WalletsPage() {
  const { data, isLoading } = useWallets();
  const wallets = data?.wallets || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-black">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">
            My Vaults
          </h1>
          <p className="text-lg font-bold text-gray-500 mt-1">
            Manage your multi-currency assets.
          </p>
        </div>
        <Link
          to="/dashboard/wallets/new"
          className="flex items-center gap-2 bg-[#FFD93D] text-black border-2 border-black px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0 active:shadow-none"
        >
          <Plus className="w-5 h-5 stroke-[3px]" />
          New Vault
        </Link>
      </div>

      {/* EMPTY STATE */}
      {wallets.length === 0 ? (
        <div className="border-4 border-black bg-white p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="w-20 h-20 bg-gray-100 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-black uppercase mb-2">
            No Vaults Found
          </h3>
          <p className="font-bold text-gray-500 mb-8">
            You haven't initialized any asset containers yet.
          </p>
          <Link
            to="/dashboard/wallets/new"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 font-bold uppercase hover:bg-[#A388EE] hover:text-black border-2 border-transparent hover:border-black transition-all"
          >
            Create First Wallet
          </Link>
        </div>
      ) : (
        /* WALLETS GRID */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {wallets.map((wallet) => (
            <Link
              key={wallet.id}
              to="/dashboard/wallets/$walletId"
              params={{ walletId: wallet.id }}
              className="group block border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
            >
              {/* TOP ROW */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-[#A388EE] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:bg-[#FFD93D] transition-colors">
                  <span className="text-xl font-black text-white group-hover:text-black">
                    {wallet.currency}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-black uppercase border-2 border-black ${
                    wallet.status === "active"
                      ? "bg-[#4ADE80] text-black"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {wallet.status}
                </span>
              </div>

              {/* BALANCE */}
              <div className="mb-4">
                <p className="text-3xl font-black text-black truncate">
                  {formatCurrency(wallet.balance, wallet.currency)}
                </p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                  Available Balance
                </p>
              </div>

              {/* FOOTER */}
              <div className="pt-4 border-t-2 border-black flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase">
                  Created: {formatDate(wallet.created_at)}
                </span>
                <ArrowRight className="w-5 h-5 text-black opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
