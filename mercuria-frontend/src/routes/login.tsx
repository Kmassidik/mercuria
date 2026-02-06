import {
  createFileRoute,
  redirect,
  useNavigate,
  Link,
} from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { validateLoginForm } from "@/utils/validators";
import { Eye, EyeOff, Loader2, Wallet, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const { login, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const validation = validateLoginForm(email, password);
    if (Object.keys(validation).length > 0) {
      setValidationErrors(validation);
      return;
    }
    setValidationErrors({});

    setIsSubmitting(true);

    try {
      await login({ email, password });
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF8] px-4 font-sans text-black">
      <div className="w-full max-w-md">
        {/* --- Header --- */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center mb-6 transition-transform hover:-translate-y-1"
          >
            <div className="flex h-16 w-16 items-center justify-center border-4 border-black bg-[#A388EE] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Wallet className="h-8 w-8 text-white" />
            </div>
          </Link>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
            Welcome Back
          </h1>
          <p className="font-bold text-gray-600">
            Sign in to manage your empire.
          </p>
        </div>

        {/* --- Card --- */}
        <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 border-4 border-black bg-[#FF6B6B] p-4 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="font-black text-xl">!</span>
                <p className="font-bold">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-black uppercase"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-black bg-gray-50 p-3 font-medium outline-none transition-all focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                placeholder="you@example.com"
                autoComplete="email"
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm font-bold text-[#FF6B6B]">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-black uppercase"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-black bg-gray-50 p-3 pr-10 font-medium outline-none transition-all focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-sm font-bold text-[#FF6B6B]">
                  {validationErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 border-2 border-black bg-[#FFD93D] py-3 text-lg font-black uppercase text-black transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 border-t-2 border-dashed border-gray-300 pt-6 text-center">
            <p className="font-bold text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-black underline decoration-2 underline-offset-4 hover:bg-[#A388EE] hover:text-white hover:decoration-transparent"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
