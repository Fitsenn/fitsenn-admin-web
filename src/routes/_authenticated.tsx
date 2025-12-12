import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { isAuthenticated } from "../auth/auth";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/login" });
    }
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  return (
    <div style={{ padding: 20 }}>
      <nav style={{ marginBottom: 20 }}>
        <a href="/dashboard" style={{ marginRight: 10 }}>
          Dashboard
        </a>
        <a href="/users">Users</a>
      </nav>

      <Outlet />
    </div>
  );
}
