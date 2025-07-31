import useSWR from "swr";

export function useSalesEffectiveness() {
  const { data, error, isLoading } = useSWR("/api/analytics/sales-effectiveness", (url) =>
    fetch(url).then((res) => res.json())
  );
  return {
    salesData: data,
    isLoading,
    isError: error,
  };
}
