'use client'

import React, { useEffect, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  FileText,
  Headphones,
  Package,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const iconMap: Record<string, JSX.Element> = {
  'Avg. Call Quality': <Headphones className="h-4 w-4 text-primary" />,
  'Script Adherence': <FileText className="h-4 w-4 text-primary" />,
  'Avg. Handle Time': <BarChart3 className="h-4 w-4 text-primary" />,
  'Customer Satisfaction': <Package className="h-4 w-4 text-primary" />,
}

const AgentPerformancePanel = () => {
  const [agentStats, setAgentStats] = useState<any[]>([])
  const [knowledge, setKnowledge] = useState<any>(null)
  const [topAgents, setTopAgents] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/agent-performance`) // update with actual endpoint
      const data = await res.json()

      const formattedStats = data.agent_stats.map((stat: any) => ({
        title: stat.title,
        value: stat.value,
        change: stat.change,
        icon: iconMap[stat.title] || <Package className="h-4 w-4 text-primary" />,
        trendIcon:
          stat.trend === 'up' ? (
            <ArrowUpRight className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDownRight className="h-3 w-3 mr-1" />
          ),
        isPositive: stat.trend === 'up',
      }))

      setAgentStats(formattedStats)
      setKnowledge(data.knowledge_distribution)
      setTopAgents(data.top_agents)
    }

    fetchData()
  }, [])

  const getTrendColor = (isPositive: boolean) =>
    isPositive ? 'text-green-600' : 'text-red-600'

  const totalKnowledge = (knowledge?.excellent ?? 0) + (knowledge?.good ?? 0) + (knowledge?.needs_improvement ?? 0)
  const getPercentage = (value: number) =>
    totalKnowledge > 0 ? `${(value / totalKnowledge) * 100}%` : '0%'

  return (
    <div className="space-y-6">
      {/* Knowledge Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-3">
          <div className="grid grid-cols-3 gap-4 h-full">
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border shadow-md flex flex-col justify-between border-green-100 dark:border-green-800/30">
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {knowledge?.excellent ?? 0}
                </div>
                <div className="text-sm font-medium text-green-700 dark:text-green-300">
                  Excellent Knowledge
                </div>
                <div className="text-xs text-muted-foreground mt-1">90% or higher</div>
              </div>
              <div className="mt-2 flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>
                  {knowledge?.excellent_change >= 0 ? '+' : ''}
                  {knowledge?.excellent_change} from last month
                </span>

              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border shadow-md flex flex-col justify-between border-amber-100 dark:border-amber-800/30">
              <div>
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {knowledge?.good ?? 0}
                </div>
                <div className="text-sm font-medium text-amber-700 dark:text-amber-300">
                  Good Knowledge
                </div>
                <div className="text-xs text-muted-foreground mt-1">75-89%</div>
              </div>
              <div className="mt-2 flex items-center text-xs text-amber-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>
                  {knowledge?.good_change >= 0 ? '+' : ''}
                  {knowledge?.good_change} from last month
                </span>

              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border shadow-md flex flex-col justify-between border-red-100 dark:border-red-800/30">
              <div>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {knowledge?.needs_improvement ?? 0}
                </div>
                <div className="text-sm font-medium text-red-700 dark:text-red-300">
                  Needs Improvement
                </div>
                <div className="text-xs text-muted-foreground mt-1">Below 75%</div>
              </div>
              <div className="mt-2 flex items-center text-xs text-red-600">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                <span>
                  {knowledge?.needs_improvement_change >= 0 ? '+' : ''}
                  {knowledge?.needs_improvement_change} from last month
                </span>

              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/30 p-4 rounded-lg shadow-sm">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-800/30 mb-2">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {knowledge?.average_score ?? '--'}%
              </div>
            </div>
            <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Average Knowledge Score
            </div>
            <div className="text-xs text-muted-foreground mt-1">{knowledge?.trend ?? ''} from last month</div>
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
        {agentStats.map((stat) => (
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
          {topAgents.map((agent) => (
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
