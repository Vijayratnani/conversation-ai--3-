import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useSentimentData() {
  const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/dashboard/sentiment`, fetcher);
  return {
    sentimentData: data ?? [],
    isLoading,
    isError: error,
  };
}
