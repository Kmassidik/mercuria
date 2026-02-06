import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { useWallets } from "@/hooks";
import { formatCurrency } from "@/utils/format";
import { Wallet, ArrowUpRight, Plus, Loader2, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useWallets();

  const wallets = data?.wallets || [];
  const totalBalance = wallets.reduce((sum, w) => {
    if (w.currency === "USD") return sum + parseFloat(w.balance);
    return sum;
  }, 0);

  return (
    <div className="space-y-8 font-sans text-black">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-black">
            Welcome, {user?.first_name || "Ruler"}
          </h1>
          <p className="font-bold text-gray-500 mt-1">
            Here is your empire's financial status.
          </p>
        </div>
        <Link
          to="/dashboard/wallets/new"
          className="flex items-center gap-2 bg-[#FFD93D] text-black border-2 border-black px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
        >
          <Plus className="w-5 h-5 stroke-[3px]" />
          Create Wallet
        </Link>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TOTAL BALANCE CARD */}
        <div className="bg-[#A388EE] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-black text-white uppercase tracking-widest mb-1">
                Total Balance
              </p>
              {isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin text-white mt-2" />
              ) : (
                <p className="text-3xl font-black text-white truncate">
                  {formatCurrency(totalBalance)}
                </p>
              )}
            </div>
            <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Wallet className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>

        {/* ACTIVE WALLETS CARD */}
        <div className="bg-[#FF6B6B] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-black text-white uppercase tracking-widest mb-1">
                Active Vaults
              </p>
              {isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin text-white mt-2" />
              ) : (
                <p className="text-3xl font-black text-white">
                  {wallets.length}
                </p>
              )}
            </div>
            <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <TrendingUp className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>

        {/* QUICK ACTION CARD (Styled as Info) */}
        <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-black text-gray-500 uppercase tracking-widest mb-1">
                Status
              </p>
              <p className="text-xl font-bold text-black">
                All Systems Operational
              </p>
            </div>
            <div className="bg-[#4ADE80] border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <ArrowUpRight className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>
      </div>

      {/* WALLETS LIST SECTION */}
      <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between mb-6 border-b-4 border-black pb-4">
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            Your Vaults
          </h2>
          <Link
            to="/dashboard/wallets"
            className="text-sm font-bold underline decoration-2 underline-offset-4 hover:bg-black hover:text-white hover:decoration-transparent transition-all px-1"
          >
            VIEW ALL
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-black" />
          </div>
        ) : wallets.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300">
            <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-bold text-gray-400 uppercase mb-6">
              No vaults found
            </p>
            <Link
              to="/dashboard/wallets/new"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 font-bold uppercase hover:bg-[#A388EE] hover:text-black border-2 border-transparent hover:border-black transition-all"
            >
              <Plus className="w-5 h-5" />
              Initialize First Vault
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {wallets.slice(0, 5).map((wallet) => (
              <Link
                key={wallet.id}
                to="/dashboard/wallets/$walletId"
                params={{ walletId: wallet.id }}
                className="group flex items-center justify-between p-4 border-2 border-black bg-white hover:bg-[#FFFDF8] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FFD93D] border-2 border-black flex items-center justify-center font-black text-lg">
                    {wallet.currency}
                  </div>
                  <div>
                    <p className="text-xl font-black text-black">
                      {formatCurrency(wallet.balance, wallet.currency)}
                    </p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {wallet.currency} Vault
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`text-xs font-black px-3 py-1 border-2 border-black uppercase ${
                      wallet.status === "active"
                        ? "bg-[#4ADE80] text-black"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {wallet.status}
                  </span>
                  <ArrowUpRight className="w-5 h-5 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
