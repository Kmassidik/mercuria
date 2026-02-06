import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { useAuth } from "@/context/AuthContext";

// 🔴 BEFORE: Private (Cannot be imported)
// interface RouterContext {
//   auth: ReturnType<typeof useAuth>;
// }

// 🟢 AFTER: Exported (Can be imported in main.tsx)
export interface RouterContext {
  auth: ReturnType<typeof useAuth>;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
});
