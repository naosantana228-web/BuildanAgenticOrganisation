import { trpc } from "@/lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

declare global {
  interface Window {
    __AGENTIC_CONFIG__?: { apiBaseUrl?: string };
  }
}

const apiBaseUrl = window.__AGENTIC_CONFIG__?.apiBaseUrl?.trim() || window.location.origin;
const trpcUrl = new URL("/api/trpc", apiBaseUrl).toString();

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: trpcUrl,
      transformer: superjson,
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
