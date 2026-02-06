import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/transactions")({
  component: TransactionsLayout,
});

function TransactionsLayout() {
  return (
    <div className="min-h-full">
      <Outlet />
    </div>
  );
}
