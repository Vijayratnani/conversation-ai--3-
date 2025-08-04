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

const focusedSentimentData: SentimentItem[] = [
  {
    product: 'Mortgages',
    positive: 30,
    neutral: 25,
    negative: 45,
    warning: true,
    causes: ['Processing delays', 'Documentation', 'Interest rates'],
  },
  {
    product: 'Investment Products',
    positive: 45,
    neutral: 30,
    negative: 25,
    warning: false,
    causes: ['Performance concerns'],
  },
]

interface Props {
  sentimentData: SentimentItem[];
}

const FocusedSentimentBreakdown: React.FC<Props> = ({ sentimentData }) => {
  return (
    <div className="space-y-4 mt-2">
      {sentimentData.slice(3).map((item) => (
        <div
          key={item.product}
          className="bg-white dark:bg-muted/20 p-3 rounded-lg border-l-4 border-l-primary shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{item.product}</span>
              {item.warning && (
                <Badge variant="destructive" className="text-xs py-0.5">
                  ⚠️
                </Badge>
              )}
            </div>
          </div>

          <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex mt-2">
            <div className="h-full bg-green-500" style={{ width: `${item.positive}%` }}></div>
            <div className="h-full bg-gray-300" style={{ width: `${item.neutral}%` }}></div>
            <div className="h-full bg-red-500" style={{ width: `${item.negative}%` }}></div>
          </div>

          <div className="flex justify-between text-sm mt-1">
            <span className="font-medium text-green-600">{item.positive}%</span>
            <span className="font-medium text-gray-500">{item.neutral}%</span>
            <span className="font-medium text-red-600">{item.negative}%</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FocusedSentimentBreakdown
