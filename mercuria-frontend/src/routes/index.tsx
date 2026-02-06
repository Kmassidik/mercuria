import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Wallet, Shield, Zap, Globe } from "lucide-react";

export const Route = createFileRoute("/")({
  // 1. Remove the 'beforeLoad' redirects so the page actually renders!
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-black font-sans selection:bg-[#FF6B6B] selection:text-white">
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 border-b-4 border-black bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-[#A388EE] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black uppercase tracking-tighter">
              Mercuria
            </span>
          </div>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="hidden items-center border-2 border-black px-6 py-2 font-bold transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none sm:flex"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 border-2 border-black bg-[#FF6B6B] px-6 py-2 font-bold text-white transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative overflow-hidden px-6 py-20 sm:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-block -rotate-2 border-2 border-black bg-[#FFD93D] px-4 py-1 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            🚀 FINANCE FOR THE BOLD
          </div>
          <h1 className="mb-8 text-5xl font-black uppercase leading-none tracking-tighter sm:text-7xl md:text-8xl">
            Manage Money <br />
            <span className="text-[#A388EE] underline decoration-4 underline-offset-8">
              Without the Bore.
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-xl font-medium text-gray-700 sm:text-2xl">
            Multi-currency wallets, instant transfers, and analytics that
            actually make sense. Stop using spreadsheets from 1999.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="flex w-full items-center justify-center gap-2 border-2 border-black bg-[#4ECDC4] px-8 py-4 text-xl font-bold text-black transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none sm:w-auto"
            >
              Open Free Account
            </Link>
            <Link
              to="/login"
              className="flex w-full items-center justify-center px-8 py-4 text-xl font-bold underline decoration-2 underline-offset-4 hover:decoration-4 sm:w-auto"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </header>

      {/* --- FEATURES GRID --- */}
      <section className="border-y-4 border-black bg-[#A388EE] px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-2">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-black bg-[#FFD93D]">
              <Globe className="h-8 w-8 text-black" />
            </div>
            <h3 className="mb-3 text-2xl font-black uppercase">
              Multi-Currency
            </h3>
            <p className="font-medium text-gray-600">
              Hold USD, EUR, JPY, and more. Switch between them instantly with
              zero hidden fees.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-2">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-black bg-[#FF6B6B]">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="mb-3 text-2xl font-black uppercase">
              Instant Transfers
            </h3>
            <p className="font-medium text-gray-600">
              Send money to other Mercuria users in milliseconds. Blink and
              you'll miss it.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-2">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-black bg-[#4ECDC4]">
              <Shield className="h-8 w-8 text-black" />
            </div>
            <h3 className="mb-3 text-2xl font-black uppercase">
              Ironclad Security
            </h3>
            <p className="font-medium text-gray-600">
              Bank-grade encryption meets paranoid-level security protocols.
              Your funds are safe.
            </p>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-4xl border-4 border-black bg-[#FFD93D] p-8 text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] sm:p-12">
          <h2 className="mb-6 text-4xl font-black uppercase sm:text-6xl">
            Ready to Take Control?
          </h2>
          <p className="mb-8 text-xl font-bold">
            Join thousands of users who trust Mercuria with their finances.
          </p>
          <Link
            to="/register"
            className="inline-block border-4 border-black bg-white px-10 py-5 text-2xl font-black uppercase text-black transition-all hover:-translate-y-1 hover:bg-black hover:text-white hover:shadow-[8px_8px_0px_0px_#A388EE] active:translate-y-0 active:shadow-none"
          >
            Start Now
          </Link>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t-4 border-black bg-black py-12 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-[#A388EE]"></div>
            <span className="text-xl font-bold uppercase">Mercuria</span>
          </div>
          <p className="font-mono text-sm text-gray-400">
            © {new Date().getFullYear()} Mercuria Finance. No rights reserved.
            Just kidding.
          </p>
        </div>
      </footer>
    </div>
  );
}
