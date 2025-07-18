// components/analytics/AgentPerformancePanel.tsx
'use client'

import React from 'react'
import { ArrowDownRight, ArrowUpRight, BarChart3, FileText, Headphones, Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const AgentPerformancePanel = () => {
  const agentStats = [
    {
      title: 'Avg. Call Quality',
      value: '86%',
      icon: <Headphones className="h-4 w-4 text-primary" />,
      change: '+2% from last month',
      trendIcon: <ArrowUpRight className="h-3 w-3 mr-1" />,
    },
    {
      title: 'Script Adherence',
      value: '92%',
      icon: <FileText className="h-4 w-4 text-primary" />,
      change: '+4% from last month',
      trendIcon: <ArrowUpRight className="h-3 w-3 mr-1" />,
    },
    {
      title: 'Avg. Handle Time',
      value: '5:24',
      icon: <BarChart3 className="h-4 w-4 text-primary" />,
      change: '-18s from last month',
      trendIcon: <ArrowDownRight className="h-3 w-3 mr-1" />,
    },
    {
      title: 'Customer Satisfaction',
      value: '4.6/5',
      icon: <Package className="h-4 w-4 text-primary" />,
      change: '+0.2 from last month',
      trendIcon: <ArrowUpRight className="h-3 w-3 mr-1" />,
    },
  ]

  const topAgents = [
    { name: 'Sarah K.', score: 94, product: 'Credit Cards', improvement: '+3%' },
    { name: 'Michael R.', score: 92, product: 'Personal Loans', improvement: '+5%' },
    { name: 'Jessica T.', score: 91, product: 'Savings Accounts', improvement: '+2%' },
  ]

  return (
    <div className="space-y-6">
      {/* Agent Knowledge Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-3">
          <div className="grid grid-cols-3 gap-4 h-full">
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 border border-green-100 dark:border-green-800/30 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">12</div>
                <div className="text-sm text-green-700 dark:text-green-300 font-medium">Excellent Knowledge</div>
                <div className="text-xs text-muted-foreground mt-1">90% or higher</div>
              </div>
              <div className="mt-2 flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>+2 from last month</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 border border-amber-100 dark:border-amber-800/30 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">18</div>
                <div className="text-sm text-amber-700 dark:text-amber-300 font-medium">Good Knowledge</div>
                <div className="text-xs text-muted-foreground mt-1">75-89%</div>
              </div>
              <div className="mt-2 flex items-center text-xs text-amber-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>+3 from last month</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 border border-red-100 dark:border-red-800/30 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">7</div>
                <div className="text-sm text-red-700 dark:text-red-300 font-medium">Needs Improvement</div>
                <div className="text-xs text-muted-foreground mt-1">Below 75%</div>
              </div>
              <div className="mt-2 flex items-center text-xs text-red-600">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                <span>-2 from last month</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border border-blue-100 dark:border-blue-800/30 p-4 rounded-lg shadow-sm">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-800/30 mb-2">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">82%</div>
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Average Knowledge Score</div>
            <div className="text-xs text-muted-foreground mt-1">+3% from last month</div>
          </div>
          <div className="mt-3">
            <div className="text-xs text-muted-foreground mb-1">Knowledge Distribution</div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
              <div className="h-full bg-green-500" style={{ width: '32%' }}></div>
              <div className="h-full bg-amber-500" style={{ width: '49%' }}></div>
              <div className="h-full bg-red-500" style={{ width: '19%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent KPIs */}
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
              <div className="flex items-center text-xs text-green-600 mt-1">
                {stat.trendIcon}
                <span>{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Performing Agents */}
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
