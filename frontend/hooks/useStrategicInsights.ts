import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export interface GrowthOpportunity {
  id: string
  topic: string
  topicUrdu: string
  mentions: number
}

export interface TopAgent {
  name: string
  score: number
}

export interface AgentPerformance {
  avgScore: number
  topAgent: TopAgent
  needsCoachingCount: number
}

export interface RiskIndicator {
  title: string
  description: string
  trend: string
  color: string
}

export interface CallEnvironmentStat {
  type: string
  label: string
  detail: string
}

export interface AvgHoldTimeStats {
  currentAvgHoldTime: string
  diffFromLastMonth: string
  isImproved: boolean
}

export interface StrategicInsightsResponse {
  growthOpportunities: GrowthOpportunity[]
  agentPerformance: AgentPerformance
  riskIndicators: RiskIndicator[]
  callEnvironmentStats: CallEnvironmentStat[]
  avgHoldTimeStats: AvgHoldTimeStats // ✅ New field added
}

export function useStrategicInsights() {
  const { data, error, isLoading } = useSWR<StrategicInsightsResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/dashboard/strategic-insights`,
    fetcher
  )

  return {
    strategicData: data ?? {
      growthOpportunities: [],
      agentPerformance: {
        avgScore: 0,
        topAgent: { name: '', score: 0 },
        needsCoachingCount: 0,
      },
      riskIndicators: [],
      callEnvironmentStats: [],
      avgHoldTimeStats: {
        currentAvgHoldTime: '0s',
        diffFromLastMonth: '↑ 0s',
        isImproved: false,
      },
    },
    isLoading,
    isError: error,
  }
}
