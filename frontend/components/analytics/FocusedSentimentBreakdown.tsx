'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'

type SentimentItem = {
  product: string
  positive: number
  neutral: number
  negative: number
  warning: boolean
  causes: string[]
}

interface Props {
  sentimentData: SentimentItem[]
}

const FocusedSentimentBreakdown: React.FC<Props> = ({ sentimentData }) => {
  const extraSentimentItems = sentimentData.slice(3)

  return (
    <div className="space-y-4 mt-2">
      {extraSentimentItems.map((item) => {
        const total = item.positive + item.neutral + item.negative || 1
        const positivePct = (item.positive / total) * 100
        const neutralPct = (item.neutral / total) * 100
        const negativePct = (item.negative / total) * 100

        return (
          <div
            key={item.product}
            className="bg-white dark:bg-muted/20 p-4 rounded-lg border-l-4 border-l-primary shadow-sm"
          >
            {/* Title + Warning */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{item.product}</span>
                {item.warning && (
                  <Badge variant="destructive" className="text-xs py-0.5">
                    ⚠️
                  </Badge>
                )}
              </div>
            </div>

            {/* Sentiment Bar */}
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
              <div className="bg-green-500 h-full" style={{ width: `${positivePct}%` }} />
              <div className="bg-gray-300 h-full" style={{ width: `${neutralPct}%` }} />
              <div className="bg-red-500 h-full" style={{ width: `${negativePct}%` }} />
            </div>

            {/* Percent labels */}
            <div className="flex justify-between text-sm mt-1">
              <span className="font-medium text-green-600">{item.positive}%</span>
              <span className="font-medium text-gray-500">{item.neutral}%</span>
              <span className="font-medium text-red-600">{item.negative}%</span>
            </div>

            {/* Optional: Causes */}
            {item.causes?.length > 0 && (
              <div className="mt-2 text-xs text-muted-foreground">
                Root causes:{" "}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {item.causes.join(', ')}
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default FocusedSentimentBreakdown
