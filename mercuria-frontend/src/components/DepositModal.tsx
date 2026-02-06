import { useState, useEffect, useRef } from "react";
import { useDeposit } from "@/hooks";
import { generateIdempotencyKey } from "@/utils/idempotency";
import { isValidAmount } from "@/utils/validators";
import { X, Loader2, ArrowDownRight } from "lucide-react";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletId: string;
  currency: string;
}

export function DepositModal({
  isOpen,
  onClose,
  walletId,
  currency,
}: DepositModalProps) {
  const { mutate, isPending, error, reset } = useDeposit(walletId);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setDescription("");
      setValidationError("");
      reset();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, reset]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidAmount(amount)) {
      setValidationError("Enter a valid amount greater than 0");
      return;
    }

    setValidationError("");

    mutate(
      {
        amount,
        description,
        idempotency_key: generateIdempotencyKey(),
      },
      { onSuccess: onClose }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans text-black">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b-4 border-black pb-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#4ADE80] border-2 border-black p-1">
              <ArrowDownRight className="w-5 h-5 text-black" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">
              Deposit Funds
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black hover:text-white border-2 border-transparent hover:border-black transition-colors"
          >
            <X className="w-6 h-6 stroke-[3px]" />
          </button>
        </div>

        {/* Error State */}
        {(error || validationError) && (
          <div className="mb-6 p-4 bg-[#FF6B6B] border-2 border-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-bold uppercase text-sm">
              {validationError ||
                (error as any)?.response?.data?.error ||
                "Deposit failed"}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-black uppercase mb-2">
              Amount ({currency})
            </label>
            <input
              ref={inputRef}
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border-2 border-black bg-gray-50 p-4 font-black text-xl outline-none focus:bg-[#FFFDF8] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-300"
              placeholder="0.00"
              inputMode="decimal"
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-black uppercase mb-2">
              Note (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-2 border-black bg-gray-50 p-3 font-bold outline-none focus:bg-[#FFFDF8] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              placeholder="Source of funds"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t-4 border-black">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 font-black uppercase border-2 border-black hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-6 py-3 font-black uppercase border-2 border-transparent hover:bg-[#4ADE80] hover:text-black hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Confirm Deposit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
