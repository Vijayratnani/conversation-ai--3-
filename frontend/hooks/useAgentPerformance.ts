import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export interface AgentStat {
  title: string
  value: number | string
  change: string
  trend: 'up' | 'down'
}

export interface KnowledgeDistribution {
  excellent: number
  good: number
  needs_improvement: number
  average_score: number
  excellent_change: number
  good_change: number
  needs_improvement_change: number
  trend: string
}

export interface TopAgent {
  name: string
  product: string
  score: number
  improvement: string
}

export interface AgentPerformanceResponse {
  agent_stats: AgentStat[]
  knowledge_distribution: KnowledgeDistribution
  top_agents: TopAgent[]
  agent_count: number
}

export function useAgentPerformance() {
  const { data, error, isLoading } = useSWR<AgentPerformanceResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/dashboard/agent-performance`,
    fetcher
  )

  return {
    data,
    isLoading,
    isError: error,
  }
}
