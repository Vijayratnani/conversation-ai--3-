'use client'

import React, { useEffect } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  FileText,
  Headphones,
  Package,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useAgentPerformance } from '@/hooks/useAgentPerformance'

export const iconMap: Record<string, JSX.Element> = {
  'Avg. Call Quality': <Headphones className="h-4 w-4 text-primary" />,
  'Script Adherence': <FileText className="h-4 w-4 text-primary" />,
  'Avg. Handle Time': <BarChart3 className="h-4 w-4 text-primary" />,
  'Customer Satisfaction': <Package className="h-4 w-4 text-primary" />,
}

interface AgentPerformancePanelProps {
  setAgentCount?: (count: number) => void
}

const AgentPerformancePanel = ({ setAgentCount }: AgentPerformancePanelProps) => {
  const { data, isLoading } = useAgentPerformance()

  useEffect(() => {
    if (data?.agent_count && setAgentCount) {
      setAgentCount(data.agent_count)
    }
  }, [data, setAgentCount])

  const agentStats = data?.agent_stats?.map((stat: any) => ({
    title: stat.title,
    value: stat.value,
    change: stat.change,
    icon: iconMap[stat.title] || <Package className="h-4 w-4 text-primary" />,
    trendIcon: stat.trend === 'up' ? (
      <ArrowUpRight className="h-3 w-3 mr-1" />
    ) : (
      <ArrowDownRight className="h-3 w-3 mr-1" />
    ),
    isPositive: stat.trend === 'up',
  })) ?? []

  const knowledge = data?.knowledge_distribution ?? {}
  const topAgents = data?.top_agents ?? []

  const totalKnowledge =
    (knowledge.excellent ?? 0) +
    (knowledge.good ?? 0) +
    (knowledge.needs_improvement ?? 0)

  const getPercentage = (value: number) =>
    totalKnowledge > 0 ? `${(value / totalKnowledge) * 100}%` : '0%'

  const getTrendColor = (isPositive: boolean) =>
    isPositive ? 'text-green-600' : 'text-red-600'

  return (
    <div className="space-y-6">
      {/* Knowledge Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-3">
          <div className="grid grid-cols-3 gap-4 h-full">
            {['excellent', 'good', 'needs_improvement'].map((key, i) => {
              const colors = {
                excellent: 'green',
                good: 'amber',
                needs_improvement: 'red',
              } as const
              const labelMap = {
                excellent: 'Excellent Knowledge',
                good: 'Good Knowledge',
                needs_improvement: 'Needs Improvement',
              }
              const range = {
                excellent: '90% or higher',
                good: '75-89%',
                needs_improvement: 'Below 75%',
              }

              const value = knowledge?.[key] ?? null
              const change = knowledge?.[`${key}_change`] ?? null

              return (
                <div
                  key={key}
                  className={`bg-${colors[key]}-50 dark:bg-${colors[key]}-900/30 p-4 rounded-lg border shadow-md flex flex-col justify-between border-${colors[key]}-100 dark:border-${colors[key]}-800/30`}
                >
                  <div>
                    <div className={`text-3xl font-bold text-${colors[key]}-600 dark:text-${colors[key]}-400`}>
                      {isLoading ? <Skeleton className="h-8 w-12" /> : value}
                    </div>
                    <div className={`text-sm font-medium text-${colors[key]}-700 dark:text-${colors[key]}-300`}>
                      {labelMap[key]}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{range[key]}</div>
                  </div>
                  <div className={`mt-2 flex items-center text-xs text-${colors[key]}-600`}>
                    {key !== 'needs_improvement' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                    <span>{change ? `${change >= 0 ? '+' : ''}${change} from last month` : <Skeleton className="h-3 w-20" />}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="col-span-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/30 p-4 rounded-lg shadow-sm">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-800/30 mb-2">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {isLoading ? <Skeleton className="h-6 w-10" /> : `${knowledge?.average_score ?? '--'}%`}
              </div>
            </div>
            <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Average Knowledge Score
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {isLoading ? <Skeleton className="h-3 w-20 mx-auto" /> : knowledge?.trend ?? ''}
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xs text-muted-foreground mb-1">Knowledge Distribution</div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
              <div className="h-full bg-green-500" style={{ width: getPercentage(knowledge?.excellent ?? 0) }} />
              <div className="h-full bg-amber-500" style={{ width: getPercentage(knowledge?.good ?? 0) }} />
              <div className="h-full bg-red-500" style={{ width: getPercentage(knowledge?.needs_improvement ?? 0) }} />
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array(4).fill(null).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))
          : agentStats.map((stat) => (
              <div
                key={stat.title}
                className="bg-white dark:bg-muted/20 p-4 rounded-lg shadow-sm border border-muted/50"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-muted-foreground">{stat.title}</div>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className={`flex items-center text-xs mt-1 ${getTrendColor(stat.isPositive)}`}>
                    {stat.trendIcon}
                    <span>{stat.change}</span>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Top Agents */}
      <div className="bg-white dark:bg-muted/20 p-4 rounded-lg shadow-sm border border-muted/50">
        <h3 className="text-sm font-medium mb-3">Top Performing Agents</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading
            ? Array(3).fill(null).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-md" />
              ))
            : topAgents.map((agent) => (
                <div key={agent.name} className="flex items-center gap-3 p-2 rounded-md bg-muted/30">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {agent.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{agent.name}</div>
                    <div className="text-xs text-muted-foreground">{agent.product} Specialist</div>
                    <div className="flex items-center text-xs text-green-600 mt-0.5">
                      <span className="font-medium mr-1">{agent.score}%</span>
                      <ArrowUpRight className="h-3 w-3 mr-0.5" />
                      <span>{agent.improvement}</span>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  )
}

export default AgentPerformancePanel
