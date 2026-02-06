import {
  createFileRoute,
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/wallets", label: "My Wallets", icon: Wallet },
  {
    to: "/dashboard/transactions",
    label: "Transactions",
    icon: ArrowLeftRight,
  },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

function DashboardLayout() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate({ to: "/login" });
    }, 300);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF8]">
        <div className="w-12 h-12 border-4 border-black border-t-[#A388EE] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] font-sans text-black flex">
      {/* =========================================================
          MOBILE BACKDROP
         ========================================================= */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =========================================================
          SIDEBAR (Neo-Brutalist)
         ========================================================= */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r-4 border-black 
          transform transition-transform duration-300 ease-in-out 
          lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen
          flex flex-col justify-between 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* TOP CONTENT: Logo & Nav */}
        <div className="flex flex-col w-full overflow-hidden">
          {/* LOGO AREA */}
          <div className="h-24 shrink-0 flex items-center px-6 border-b-4 border-black bg-white">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 w-full"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="flex h-12 w-12 items-center justify-center border-2 border-black bg-[#A388EE] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <ShieldCheck className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="block font-black text-2xl uppercase tracking-tighter text-black">
                  Mercuria
                </span>
                <span className="block text-xs font-bold bg-black text-white px-1 w-fit">
                  EMPIRE
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto lg:hidden text-black hover:bg-black hover:text-white border-2 border-transparent hover:border-black transition-colors p-1"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="px-4 py-6 space-y-3 overflow-y-auto">
            <div className="px-2 mb-4">
              <p className="text-xs font-black uppercase tracking-widest text-gray-500">
                Menu
              </p>
            </div>
            {navItems.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 px-4 py-3 border-2 transition-all duration-200 ${
                    active
                      ? "bg-[#FFD93D] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
                      : "bg-transparent border-transparent hover:border-black hover:bg-gray-50 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      active
                        ? "text-black stroke-[3px]"
                        : "text-gray-500 group-hover:text-black"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      active
                        ? "font-black uppercase"
                        : "font-bold text-gray-600 group-hover:text-black"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM CONTENT: User Profile & Logout */}
        <div className="p-4 border-t-4 border-black bg-gray-50 shrink-0">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-10 h-10 border-2 border-black bg-white rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <User className="w-5 h-5 text-black" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-black truncate uppercase">
                {user?.first_name || "TOOLS"}
              </p>
              <p className="text-xs font-medium text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-black uppercase text-white bg-[#FF6B6B] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* =========================================================
          MAIN CONTENT AREA
         ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* MOBILE HEADER */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b-4 border-black h-16 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border-2 border-black bg-[#A388EE] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl uppercase tracking-tighter">
              Mercuria
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 text-black border-2 border-transparent hover:border-black hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-7 h-7" />
          </button>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
