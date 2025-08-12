'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export type SentimentItem = {
  product?: string
  positive?: number
  neutral?: number
  negative?: number
  warning?: boolean
  causes?: string[]
}

interface SentimentOverviewCardsProps {
  sentimentData: SentimentItem[]
  setSelectedSentimentItem: (item: SentimentItem) => void
  setIsSentimentDetailDialogOpen: (open: boolean) => void
}

const SentimentOverviewCards: React.FC<SentimentOverviewCardsProps> = ({
  sentimentData,
  setSelectedSentimentItem,
  setIsSentimentDetailDialogOpen,
}) => {
  const dataToRender =
    sentimentData.length > 0
      ? sentimentData.slice(0, 3) // Show top 3
      : [
          {
            product: 'Demo Product',
            positive: 60,
            neutral: 30,
            negative: 10,
            warning: false,
            causes: [],
          },
        ]

  return (
    <div className="space-y-3">
      {dataToRender.map((item, idx) => {
        const total = (item.positive ?? 0) + (item.neutral ?? 0) + (item.negative ?? 0) || 1
        const positivePct = ((item.positive ?? 0) / total) * 100
        const neutralPct = ((item.neutral ?? 0) / total) * 100
        const negativePct = ((item.negative ?? 0) / total) * 100

        return (
          <div
            key={item.product ?? `product-${idx}`}
            className="rounded-xl border shadow-sm bg-white dark:bg-gray-900 px-4 py-3 flex flex-col space-y-2"
          >
            {/* Title Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium text-sm">
                {item.product ?? 'Unnamed Product'}
                {item.warning && (
                  <Badge variant="destructive" className="text-xs flex items-center gap-1">
                    ⚠️
                  </Badge>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-s px-4 py-1 h-auto"
                onClick={() => {
                  setSelectedSentimentItem(item)
                  setIsSentimentDetailDialogOpen(true)
                }}
              >
                Details
              </Button>
            </div>

            {/* Sentiment Bar */}
            <div className="h-2 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 flex">
              <div className="bg-green-500" style={{ width: `${positivePct}%` }}></div>
              <div className="bg-gray-400" style={{ width: `${neutralPct}%` }}></div>
              <div className="bg-red-500" style={{ width: `${negativePct}%` }}></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SentimentOverviewCards
