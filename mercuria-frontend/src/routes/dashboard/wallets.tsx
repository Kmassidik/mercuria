import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/wallets")({
  component: WalletsLayout,
});

function WalletsLayout() {
  return (
    <div className="h-full">
      <Outlet />
    </div>
  );
}
