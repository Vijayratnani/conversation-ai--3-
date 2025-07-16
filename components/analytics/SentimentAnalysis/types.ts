// components/analytics/SentimentAnalysis/types.ts

export interface SentimentItem {
  product: string
  positive: number
  neutral: number
  negative: number
  warning: boolean
  causes: string[]
}
