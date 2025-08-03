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
  const dataToRender = sentimentData.length > 0
    ? sentimentData
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
    <div className="grid gap-2">
      {dataToRender.map((item, idx) => (
        <div
          key={item.product ?? `product-${idx}`}
          className="bg-white dark:bg-muted/20 p-3 rounded-lg border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{item.product ?? 'Unnamed Product'}</span>
              {item.warning && (
                <Badge variant="destructive" className="text-xs py-0.5">
                  ⚠️
                </Badge>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs glass-effect bg-transparent"
              onClick={() => {
                setSelectedSentimentItem(item)
                setIsSentimentDetailDialogOpen(true)
              }}
            >
              Details
            </Button>
          </div>

          <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex mt-2">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${item.positive ?? 0}%` }}
            ></div>
            <div
              className="h-full bg-gray-300 transition-all duration-500"
              style={{ width: `${item.neutral ?? 0}%` }}
            ></div>
            <div
              className="h-full bg-red-500 transition-all duration-500"
              style={{ width: `${item.negative ?? 0}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SentimentOverviewCards
