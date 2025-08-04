'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'

type ProductSentiment = {
  product: string
  positive: number
  neutral: number
  negative: number
  warning: boolean
  causes: string[]
}

const mockSentimentData: ProductSentiment[] = [
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
  sentimentData: ProductSentiment[];
}

const ProductSentimentList: React.FC<Props> = ({ sentimentData }) => {
  return (
    <div className="space-y-4 mt-2 max-h-[70vh] overflow-y-auto pr-2">
      {sentimentData.map((item) => (
        <div
          key={item.product}
          className="space-y-2 bg-white dark:bg-muted/20 p-4 rounded-lg border-l-4 border-l-primary shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base font-medium">{item.product}</span>
              {item.warning && (
                <Badge variant="destructive" className="text-xs py-0.5">
                  ⚠️ Consistent Negative
                </Badge>
              )}
            </div>
          </div>

          <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex">
            <div className="h-full bg-green-500" style={{ width: `${item.positive}%` }}></div>
            <div className="h-full bg-gray-300" style={{ width: `${item.neutral}%` }}></div>
            <div className="h-full bg-red-500" style={{ width: `${item.negative}%` }}></div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="font-medium text-green-600">{item.positive}% Positive</span>
            <span className="font-medium text-gray-500">{item.neutral}% Neutral</span>
            <span className="font-medium text-red-600">{item.negative}% Negative</span>
          </div>

          <div className="mt-2 bg-muted/10 p-2 rounded-md">
            <span className="text-sm font-semibold">Root causes: </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {item.causes.map((cause) => (
                <Badge key={cause} variant="outline" className="bg-white dark:bg-muted/30">
                  {cause}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductSentimentList
