import useSWR from "swr";

export function useSalesEffectiveness() {
  const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/dashboard/sales-effectiveness`, (url) =>
    fetch(url).then((res) => res.json())
  );
  return {
    salesData: data,
    isLoading,
    isError: error,
  };
}
