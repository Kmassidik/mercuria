import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { formatDateTime } from "@/utils/format";
import { User, Mail, Calendar, Shield, LogOut } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // The Layout's useEffect will handle the redirect,
    // but we can add a small timeout logic here if needed for animation
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 font-sans text-black">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tighter">
          Settings
        </h1>
        <p className="text-lg font-bold text-gray-500 mt-1">
          Manage your identity and security protocols.
        </p>
      </div>

      {/* PROFILE INFORMATION CARD */}
      <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3 border-b-4 border-black pb-4 mb-6">
          <div className="w-8 h-8 bg-black flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            Profile Data
          </h2>
        </div>

        <div className="space-y-4">
          {/* Name Row */}
          <div className="group flex items-center gap-4 p-4 border-2 border-black bg-gray-50 hover:bg-[#FFFDF8] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200">
            <div className="w-12 h-12 border-2 border-black bg-[#60A5FA] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <User className="w-6 h-6 text-black" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-gray-500 tracking-wider">
                Full Name
              </p>
              <p className="text-lg font-bold truncate">
                {user?.first_name || user?.last_name
                  ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim()
                  : "NO NAME SET"}
              </p>
            </div>
          </div>

          {/* Email Row */}
          <div className="group flex items-center gap-4 p-4 border-2 border-black bg-gray-50 hover:bg-[#FFFDF8] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200">
            <div className="w-12 h-12 border-2 border-black bg-[#4ADE80] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Mail className="w-6 h-6 text-black" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-gray-500 tracking-wider">
                Email Address
              </p>
              <p className="text-lg font-bold truncate">{user?.email}</p>
            </div>
          </div>

          {/* Date Row */}
          <div className="group flex items-center gap-4 p-4 border-2 border-black bg-gray-50 hover:bg-[#FFFDF8] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200">
            <div className="w-12 h-12 border-2 border-black bg-[#A388EE] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Calendar className="w-6 h-6 text-black" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-gray-500 tracking-wider">
                Joined Empire
              </p>
              <p className="text-lg font-bold">
                {user?.created_at ? formatDateTime(user.created_at) : "UNKNOWN"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECURITY CARD */}
      <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3 border-b-4 border-black pb-4 mb-6">
          <div className="w-8 h-8 bg-black flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            Security
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-2 border-black bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-2 border-black bg-[#FFD93D] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <div>
              <p className="text-lg font-black uppercase">Password</p>
              <p className="text-sm font-bold text-gray-500">
                Last updated: UNKNOWN
              </p>
            </div>
          </div>
          <button className="bg-white border-2 border-black px-6 py-2 text-sm font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0 active:shadow-none">
            Change
          </button>
        </div>

        <p className="mt-4 text-sm font-bold text-gray-500 border-l-4 border-[#FFD93D] pl-4 py-1">
          Protect your empire. Use strong passwords and enable 2FA protocols
          immediately.
        </p>
      </div>

      {/* DANGER ZONE (Red) */}
      <div className="border-4 border-black bg-[#FF6B6B] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-white">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-black">
              Danger Zone
            </h2>
            <p className="font-bold text-black/80 max-w-md mt-1">
              Terminating your session will require re-authentication to access
              the dashboard.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white text-[#FF6B6B] border-2 border-black px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0 active:shadow-none flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <LogOut className="w-5 h-5 stroke-[3px]" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
