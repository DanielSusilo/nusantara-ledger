import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/customs/")({
  beforeLoad: () => {
    throw redirect({ to: "/customs/verify" });
  },
});
