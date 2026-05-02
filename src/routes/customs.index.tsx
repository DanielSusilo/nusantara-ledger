import { createFileRoute, redirect } from "@tanstack/react-router";

// Customs root → redirect to verify
export const Route = createFileRoute("/customs/")({
  beforeLoad: () => {
    throw redirect({ to: "/customs/verify" });
  },
});
