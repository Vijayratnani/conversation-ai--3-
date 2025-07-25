'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type SentimentItem = {
  product: string
  positive: number
  neutral: number
  negative: number
  warning: boolean
  causes: string[]
}

interface SentimentOverviewCardsProps {
  setSelectedSentimentItem: (item: SentimentItem) => void
  setIsSentimentDetailDialogOpen: (open: boolean) => void
}

const sentimentData: SentimentItem[] = [
  {
    product: 'Credit Cards',
    positive: 25,
    neutral: 30,
    negative: 45,
    warning: true,
    causes: ['Hidden fees', 'Interest rates', 'Customer service'],
  },
  {
    product: 'Personal Loans',
    positive: 40,
    neutral: 35,
    negative: 25,
    warning: false,
    causes: ['Application process', 'Approval time'],
  },
  {
    product: 'Savings Accounts',
    positive: 55,
    neutral: 30,
    negative: 15,
    warning: false,
    causes: ['Interest rates'],
  },
]

const SentimentOverviewCards: React.FC<SentimentOverviewCardsProps> = ({
  setSelectedSentimentItem,
  setIsSentimentDetailDialogOpen,
}) => {
  return (
    <div className="grid gap-2">
      {sentimentData.map((item) => (
        <div
          key={item.product}
          className="bg-white dark:bg-muted/20 p-3 rounded-lg border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow"
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
              style={{ width: `${item.positive}%` }}
            ></div>
            <div
              className="h-full bg-gray-300 transition-all duration-500"
              style={{ width: `${item.neutral}%` }}
            ></div>
            <div
              className="h-full bg-red-500 transition-all duration-500"
              style={{ width: `${item.negative}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SentimentOverviewCards
