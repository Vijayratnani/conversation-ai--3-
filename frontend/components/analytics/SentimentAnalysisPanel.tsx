'use client'

import React from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type SentimentItem = {
  positive: number
  neutral: number
  negative: number
  causes: string[]
  warning: boolean
}

interface SentimentAnalysisPanelProps {
  selectedSentimentItem: SentimentItem
}

const SentimentAnalysisPanel: React.FC<SentimentAnalysisPanelProps> = ({ selectedSentimentItem }) => {
  return (
    <div className="space-y-4 mt-2">
      {/* Sentiment Distribution */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>Sentiment Distribution</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Positive</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span>Neutral</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Negative</span>
            </div>
          </div>
        </div>

        <div className="h-4 w-full bg-muted rounded-full overflow-hidden flex">
          <div
            className="h-full bg-green-500"
            style={{ width: `${selectedSentimentItem.positive}%` }}
          ></div>
          <div
            className="h-full bg-gray-300"
            style={{ width: `${selectedSentimentItem.neutral}%` }}
          ></div>
          <div
            className="h-full bg-red-500"
            style={{ width: `${selectedSentimentItem.negative}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-sm">
          <span className="font-medium text-green-600">{selectedSentimentItem.positive}% Positive</span>
          <span className="font-medium text-gray-500">{selectedSentimentItem.neutral}% Neutral</span>
          <span className="font-medium text-red-600">{selectedSentimentItem.negative}% Negative</span>
        </div>
      </div>

      {/* Root Causes */}
      <div className="bg-muted/20 p-4 rounded-md">
        <h4 className="text-sm font-semibold mb-2">Root Causes of Dissatisfaction</h4>
        <div className="flex flex-wrap gap-2">
          {selectedSentimentItem.causes.map((cause) => (
            <Badge key={cause} variant="outline" className="bg-white dark:bg-muted/30">
              {cause}
            </Badge>
          ))}
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="bg-muted/20 p-4 rounded-md">
        <h4 className="text-sm font-semibold mb-2">Trend Analysis</h4>
        <div className="flex items-center gap-2">
          {selectedSentimentItem.warning ? (
            <>
              <ArrowUpRight className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-500">
                Negative sentiment increasing over the past 3 months
              </span>
            </>
          ) : (
            <>
              <ArrowDownRight className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500">
                Negative sentiment decreasing over the past 3 months
              </span>
            </>
          )}
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="bg-muted/20 p-4 rounded-md">
        <h4 className="text-sm font-semibold mb-2">Recommended Actions</h4>
        <ul className="text-sm space-y-1 list-disc pl-4">
          {selectedSentimentItem.warning ? (
            <>
              <li>Review customer feedback for specific pain points</li>
              <li>Conduct targeted customer interviews</li>
              <li>Develop action plan to address top issues</li>
            </>
          ) : (
            <>
              <li>Continue monitoring sentiment trends</li>
              <li>Maintain current customer service approach</li>
              <li>Share positive feedback with product teams</li>
            </>
          )}
        </ul>
      </div>
    </div>
  )
}

export default SentimentAnalysisPanel
