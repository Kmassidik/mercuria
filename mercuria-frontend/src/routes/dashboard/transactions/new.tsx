import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useWallets, useCreateTransaction } from "@/hooks";
import { validateTransferForm, isValidAmount } from "@/utils/validators";
import { generateIdempotencyKey } from "@/utils/idempotency";
import { formatCurrency } from "@/utils/format";
import { Loader2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/dashboard/transactions/new")({
  component: NewTransactionPage,
});

function NewTransactionPage() {
  const navigate = useNavigate();
  const { data: walletsData, isLoading: walletsLoading } = useWallets();
  const { mutate, isPending, error } = useCreateTransaction();

  const wallets = walletsData?.wallets || [];

  const [fromWalletId, setFromWalletId] = useState("");
  const [toWalletId, setToWalletId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedWallet = wallets.find((w) => w.id === fromWalletId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateTransferForm(toWalletId, amount);
    if (!fromWalletId) validation.fromWalletId = "Source wallet required";
    if (fromWalletId === toWalletId)
      validation.toWalletId = "Cannot transfer to self";

    if (selectedWallet && isValidAmount(amount)) {
      if (parseFloat(amount) > parseFloat(selectedWallet.balance)) {
        validation.amount = "Insufficient funds";
      }
    }

    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setErrors({});

    mutate(
      {
        from_wallet_id: fromWalletId,
        to_wallet_id: toWalletId,
        amount,
        description,
        idempotency_key: generateIdempotencyKey(),
      },
      {
        onSuccess: (data) => {
          navigate({
            to: "/dashboard/transactions/$transactionId",
            params: { transactionId: data.transaction.id },
          });
        },
      }
    );
  };

  if (walletsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-8 font-sans text-black">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tighter">
          New Transfer
        </h1>
        <p className="text-lg font-bold text-gray-500 mt-1">
          Initiate a secure fund transfer.
        </p>
      </div>

      {error && (
        <div className="border-4 border-black bg-[#FF6B6B] p-4 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-bold">
            {(error as any).response?.data?.error || "Transfer failed"}
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6"
      >
        {/* FROM WALLET */}
        <div>
          <label className="block text-sm font-black uppercase mb-2">
            From Wallet
          </label>
          <select
            value={fromWalletId}
            onChange={(e) => setFromWalletId(e.target.value)}
            className={`w-full border-2 p-3 font-bold outline-none transition-all ${
              errors.fromWalletId
                ? "border-red-500 bg-red-50"
                : "border-black bg-gray-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            }`}
          >
            <option value="">-- SELECT SOURCE --</option>
            {wallets.map((w) => (
              <option key={w.id} value={w.id}>
                {w.currency} — {formatCurrency(w.balance, w.currency)}
              </option>
            ))}
          </select>
          {errors.fromWalletId && (
            <p className="mt-1 text-sm font-bold text-red-500 uppercase">
              {errors.fromWalletId}
            </p>
          )}
        </div>

        {/* TO WALLET */}
        <div>
          <label className="block text-sm font-black uppercase mb-2">
            Recipient ID
          </label>
          <input
            type="text"
            value={toWalletId}
            onChange={(e) => setToWalletId(e.target.value)}
            className={`w-full border-2 p-3 font-bold outline-none transition-all ${
              errors.toWalletId
                ? "border-red-500 bg-red-50"
                : "border-black bg-gray-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            }`}
            placeholder="UUID-..."
          />
          {errors.toWalletId && (
            <p className="mt-1 text-sm font-bold text-red-500 uppercase">
              {errors.toWalletId}
            </p>
          )}
        </div>

        {/* AMOUNT */}
        <div>
          <label className="block text-sm font-black uppercase mb-2">
            Amount
          </label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`w-full border-2 p-3 font-bold outline-none transition-all ${
              errors.amount
                ? "border-red-500 bg-red-50"
                : "border-black bg-gray-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            }`}
            placeholder="0.00"
          />
          {selectedWallet && (
            <div className="mt-2 text-right">
              <span className="text-xs font-black bg-[#FFD93D] px-2 py-1 border border-black uppercase">
                Max:{" "}
                {formatCurrency(
                  selectedWallet.balance,
                  selectedWallet.currency
                )}
              </span>
            </div>
          )}
          {errors.amount && (
            <p className="mt-1 text-sm font-bold text-red-500 uppercase">
              {errors.amount}
            </p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-black uppercase mb-2">
            Description (Optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border-2 border-black bg-gray-50 p-3 font-bold outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            placeholder="Payment Reference"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4 border-t-4 border-black mt-6">
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard/transactions" })}
            className="px-6 py-3 font-black uppercase border-2 border-black hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-6 py-3 font-black uppercase border-2 border-transparent hover:bg-[#A388EE] hover:text-black hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Confirm Transfer <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
