import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useSentimentData() {
  const { data, error, isLoading } = useSWR("/api/analytics/sentiment", fetcher);
  return {
    sentimentData: data ?? [],
    isLoading,
    isError: error,
  };
}
