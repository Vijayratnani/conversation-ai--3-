'use client'

import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Training {
  title: string
  link?: string
}

interface Trend {
  direction: 'up' | 'down' | 'flat'
  change: string
  period: string
}

interface KnowledgeItem {
  score: number
  scoreTrend?: Trend
  issues: string
  specificExamples?: string[]
  recommendedTraining?: Training[]
  actionableSteps?: string[]
}

interface KnowledgeAssessmentDetailsProps {
  selectedKnowledgeItem: KnowledgeItem
}

const KnowledgeAssessmentDetails: React.FC<KnowledgeAssessmentDetailsProps> = ({
  selectedKnowledgeItem,
}) => {
  return (
    <div className="mt-4 space-y-6 pr-2 max-h-[60vh] overflow-y-auto">
      {/* Score Section */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-muted-foreground">Overall Score</h4>
        <div className="flex items-center">
          <span
            className={`text-3xl font-bold ${
              selectedKnowledgeItem.score > 80
                ? 'text-green-600'
                : selectedKnowledgeItem.score > 70
                ? 'text-amber-600'
                : 'text-red-600'
            }`}
          >
            {selectedKnowledgeItem.score}%
          </span>
          {selectedKnowledgeItem.scoreTrend && (
            <Badge
              variant="outline"
              className={`ml-3 ${
                selectedKnowledgeItem.scoreTrend.direction === 'up'
                  ? 'border-green-500 text-green-600'
                  : selectedKnowledgeItem.scoreTrend.direction === 'down'
                  ? 'border-red-500 text-red-600'
                  : ''
              }`}
            >
              {selectedKnowledgeItem.scoreTrend.direction === 'up' ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : selectedKnowledgeItem.scoreTrend.direction === 'down' ? (
                <ArrowDownRight className="h-3 w-3 mr-1" />
              ) : null}
              {selectedKnowledgeItem.scoreTrend.change} {selectedKnowledgeItem.scoreTrend.period}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{selectedKnowledgeItem.issues}</p>
      </div>

      {/* Examples / Gaps */}
      {selectedKnowledgeItem.specificExamples?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground">Specific Examples / Gaps Noted</h4>
          <ul className="list-disc list-inside text-sm space-y-1 bg-muted/50 p-3 rounded-md">
            {selectedKnowledgeItem.specificExamples.map((example, idx) => (
              <li key={idx}>{example}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Training */}
      {selectedKnowledgeItem.recommendedTraining?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground">Recommended Training</h4>
          <div className="space-y-2">
            {selectedKnowledgeItem.recommendedTraining.map((training, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-sm bg-muted/50 p-3 rounded-md"
              >
                <span>{training.title}</span>
                {training.link && training.link !== '#' ? (
                  <Button variant="link" size="sm" asChild>
                    <a href={training.link} target="_blank" rel="noopener noreferrer">
                      Access Module <ArrowUpRight className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                ) : (
                  <Badge variant="secondary">Coming Soon</Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Steps */}
      {selectedKnowledgeItem.actionableSteps?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground">Actionable Next Steps for Agent</h4>
          <ul className="list-disc list-inside text-sm space-y-1 bg-muted/50 p-3 rounded-md">
            {selectedKnowledgeItem.actionableSteps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default KnowledgeAssessmentDetails
