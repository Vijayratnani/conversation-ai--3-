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

interface StrategicInsightsPanelProps {
  growthOpportunities: GrowthOpportunity[]
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
            3 High Priority
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="bg-muted/30 p-2 rounded-md border-l-2 border-red-500">
            <div className="text-sm font-medium">Compliance Risk</div>
            <div className="text-xs text-muted-foreground">Disclosure phrase missing in 18% of calls</div>
            <div className="text-xs font-medium text-red-600 mt-1">↑ 4% from last month</div>
          </div>
          <div className="bg-muted/30 p-2 rounded-md border-l-2 border-amber-500">
            <div className="text-sm font-medium">Customer Churn Risk</div>
            <div className="text-xs text-muted-foreground">Competitor mentions up 12%</div>
            <div className="text-xs font-medium text-amber-600 mt-1">High risk in Credit Cards</div>
          </div>
        </div>
      </div>

      {/* Agent Performance */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Agent Performance</h4>
          <div className="text-sm font-medium text-primary">78% Avg. Quality Score</div>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: '78%' }}></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Top agent: Sarah K. (94%)</span>
          <span>Needs coaching: 3 agents</span>
        </div>
      </div>

      {/* Growth Opportunities */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Growth Opportunities</h4>
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400">
            4 Identified
          </Badge>
        </div>
        <div className="bg-muted/30 p-3 rounded-md">
          <div className="space-y-2">
            {(growthOpportunities ?? []).map((item) => (
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
          {[
            {
              label: 'Dog Barking',
              detail: 'Detected in 8% of calls',
              type: 'dog-barking',
            },
            {
              label: 'Cafe Chatter',
              detail: 'Detected in 6% of calls',
              type: 'cafe-chatter',
            },
          ].map((noise) => (
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

          <div className="bg-muted/30 p-3 rounded-md text-center flex flex-col justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Avg. Hold Time</div>
              <div className="text-sm font-medium mt-1">1m 42s</div>
            </div>
            <div className="text-xs text-green-600 mt-2">↓ 12s from last month</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StrategicInsightsPanel
