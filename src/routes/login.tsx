import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "../auth/auth";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/login"!</div>;
}
