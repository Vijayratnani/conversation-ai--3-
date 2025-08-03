'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Pause, Play } from 'lucide-react'

interface GrowthOpportunity {
  id: string
  topic: string
  topicUrdu: string
  mentions: number
}

interface RiskIndicator {
  title: string
  description: string
  trend: string
  color: string
}

interface AgentPerformance {
  avgScore: number
  topAgent: {
    name: string
    score: number
  }
  needsCoachingCount: number
}

interface CallEnvironmentStat {
  type: string
  label: string
  detail: string
}
interface AvgHoldTimeStats {
  currentAvgHoldTime: string // e.g., "1m 42s"
  diffFromLastMonth: string  // e.g., "↓ 12s"
  isImproved: boolean        // for green/red text styling
}

interface StrategicInsightsPanelProps {
  growthOpportunities: GrowthOpportunity[]
  riskIndicators: RiskIndicator[]
  agentPerformance: AgentPerformance
  callEnvironmentStats: CallEnvironmentStat[]
  avgHoldTimeStats: AvgHoldTimeStats
  mockMentionsData: Record<string, string[]>
  togglePlay: (audioType: string) => void
  playingAudio: string | null
  setSelectedGrowthOpportunityTopic: (topic: string) => void
  setSelectedGrowthOpportunityTopicUrdu: (topicUrdu: string) => void
  setCurrentTopicMentions: (mentions: string[]) => void
  setIsGrowthOpportunityDetailDialogOpen: (open: boolean) => void
  isGrowthOpportunityDetailDialogOpen: boolean
  selectedGrowthOpportunityTopic: string
}

const StrategicInsightsPanel: React.FC<StrategicInsightsPanelProps> = ({
  growthOpportunities,
  riskIndicators,
  agentPerformance,
  callEnvironmentStats,
  avgHoldTimeStats,
  mockMentionsData,
  togglePlay,
  playingAudio,
  setSelectedGrowthOpportunityTopic,
  setSelectedGrowthOpportunityTopicUrdu,
  setCurrentTopicMentions,
  setIsGrowthOpportunityDetailDialogOpen,
  isGrowthOpportunityDetailDialogOpen,
  selectedGrowthOpportunityTopic
}) => {
  return (
    <div className="space-y-6">
      {/* Risk Indicators */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Risk Indicators</h4>
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400">
            {riskIndicators.length} High Priority
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {riskIndicators.map((risk, idx) => (
            <div
              key={idx}
              className="bg-muted/30 p-2 rounded-md border-l-2"
              style={{ borderColor: risk.color.includes("red") ? "#ef4444" : "#f59e0b" }}
            >
              <div className="text-sm font-medium">{risk.title}</div>
              <div className="text-xs text-muted-foreground">{risk.description}</div>
              <div className={`text-xs font-medium mt-1 ${risk.color}`}>{risk.trend}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Performance */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Agent Performance</h4>
          <div className="text-sm font-medium text-primary">
            {agentPerformance.avgScore}% Avg. Quality Score
          </div>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${agentPerformance.avgScore}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>
            Top agent: {agentPerformance.topAgent.name} ({agentPerformance.topAgent.score}%)
          </span>
          <span>Needs coaching: {agentPerformance.needsCoachingCount} agents</span>
        </div>
      </div>

      {/* Growth Opportunities */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Growth Opportunities</h4>
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400">
            {growthOpportunities.length} Identified
          </Badge>
        </div>
        <div className="bg-muted/30 p-3 rounded-md">
          <div className="space-y-2">
            {growthOpportunities.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs">
                <span className="font-medium">{item.topic}</span>
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs p-0 h-auto text-green-600 hover:text-green-700"
                  onClick={() => {
                    setSelectedGrowthOpportunityTopic(item.topic)
                    setSelectedGrowthOpportunityTopicUrdu(item.topicUrdu)
                    setCurrentTopicMentions(mockMentionsData[item.topic] || [])
                    setIsGrowthOpportunityDetailDialogOpen(true)
                  }}
                  aria-haspopup="dialog"
                  aria-expanded={isGrowthOpportunityDetailDialogOpen && selectedGrowthOpportunityTopic === item.topic}
                >
                  {item.mentions} mentions <ArrowRight className="h-3 w-3 ml-1 opacity-70" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call Environment */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Call Environment Analysis</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {callEnvironmentStats.map((noise) => (
            <div
              key={noise.type}
              className="bg-muted/30 p-3 rounded-md text-center flex flex-col justify-between"
            >
              <div>
                <div className="text-xs text-muted-foreground">Background Noise: {noise.label}</div>
                <div className="text-sm font-medium mt-1">{noise.detail}</div>
              </div>
              <div className="mt-2">
                <Button variant="outline" size="sm" onClick={() => togglePlay(noise.type)}>
                  {playingAudio === noise.type ? (
                    <Pause className="h-4 w-4 mr-2" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Sample
                </Button>
              </div>
            </div>
          ))}
          {avgHoldTimeStats && (
            <div className="bg-muted/30 p-3 rounded-md text-center flex flex-col justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Avg. Hold Time</div>
                <div className="text-sm font-medium mt-1">
                  {avgHoldTimeStats.currentAvgHoldTime}
                </div>
              </div>
              <div
                className={`text-xs mt-2 ${avgHoldTimeStats.isImproved ? 'text-green-600' : 'text-red-600'
                  }`}
              >
                {avgHoldTimeStats.diffFromLastMonth} from last month
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  )
}

export default StrategicInsightsPanel
