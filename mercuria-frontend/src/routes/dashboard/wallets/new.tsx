import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCreateWallet } from "@/hooks";
import { CURRENCIES } from "@/utils/constants";
import { Loader2, Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/dashboard/wallets/new")({
  component: NewWalletPage,
});

function NewWalletPage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useCreateWallet();
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);

  const handleCreate = () => {
    if (!selectedCurrency) return;

    mutate(
      { currency: selectedCurrency },
      {
        onSuccess: (data) => {
          navigate({
            to: "/dashboard/wallets/$walletId",
            params: { walletId: data.wallet.id },
          });
        },
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 font-sans text-black">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tighter">
          Initialize Vault
        </h1>
        <p className="text-lg font-bold text-gray-500 mt-1">
          Select the base currency for your new asset container.
        </p>
      </div>

      {error && (
        <div className="border-4 border-black bg-[#FF6B6B] p-4 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-bold">
            {(error as any).response?.data?.error || "Failed to create wallet"}
          </p>
        </div>
      )}

      {/* CURRENCY GRID */}
      <div className="grid gap-4 sm:grid-cols-2">
        {CURRENCIES.map((currency) => (
          <button
            key={currency.code}
            onClick={() => setSelectedCurrency(currency.code)}
            className={`group relative p-6 border-4 text-left transition-all duration-200 ${
              selectedCurrency === currency.code
                ? "border-black bg-[#A388EE] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
                : "border-black bg-white hover:bg-[#FFFDF8] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-2xl font-black ${selectedCurrency === currency.code ? "text-white" : "text-black"}`}
                >
                  {currency.code}
                </p>
                <p
                  className={`text-sm font-bold uppercase ${selectedCurrency === currency.code ? "text-white/80" : "text-gray-500"}`}
                >
                  {currency.name}
                </p>
              </div>
              <div
                className={`w-8 h-8 border-2 border-black flex items-center justify-center bg-white ${
                  selectedCurrency === currency.code
                    ? "shadow-none"
                    : "shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                }`}
              >
                {selectedCurrency === currency.code && (
                  <Check className="w-6 h-6 text-black stroke-[4px]" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4 pt-6 border-t-4 border-black">
        <button
          onClick={() => navigate({ to: "/dashboard/wallets" })}
          className="px-8 py-4 font-black uppercase border-2 border-black hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          disabled={!selectedCurrency || isPending}
          className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-8 py-4 font-black uppercase border-2 border-transparent hover:bg-[#FFD93D] hover:text-black hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:bg-gray-400"
        >
          {isPending ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Confirm Creation <ArrowRight className="w-6 h-6" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
