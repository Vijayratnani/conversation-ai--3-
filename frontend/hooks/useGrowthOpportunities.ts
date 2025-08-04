import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export interface CallMentionDetail {
  callId: string
  callDate: string
  agentName: string
  customerIdentifier: string
  mentionSnippet: string
}

export interface GrowthOpportunity {
  id: string
  topic: string
  topicUrdu: string
  mentions: number
  trend: string
}

export interface GrowthOpportunitiesResponse {
  growthOpportunities: GrowthOpportunity[]
  mockMentionsData: Record<string, CallMentionDetail[]>
}

export function useGrowthOpportunities() {
  const { data, error, isLoading } = useSWR<GrowthOpportunitiesResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/dashboard/topic-mentions`,
    fetcher
  )

  return {
    data: data ?? {
      growthOpportunities: [],
      mockMentionsData: {},
    },
    isLoading,
    isError: error,
  }
}
