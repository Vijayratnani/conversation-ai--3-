// hooks/useDashboardData.ts
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useProductStats() {
  return useSWR("/api/dashboard/product-stats", fetcher);
}

export function useAgentKPI() {
  return useSWR("/api/dashboard/agent-kpis", fetcher);
}

// And so on...
