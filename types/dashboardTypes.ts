import type { LucideIcon } from "lucide-react"

export interface ProductKnowledgeItem {
  product: string
  score: number
  issues: string
  color: string
  specificExamples: string[]
  recommendedTraining: { title: string; link: string }[]
  scoreTrend: { period: string; change: string; direction: "up" | "down" }
  actionableSteps: string[]
}

export interface ProductStatItem {
  id: string
  title: string
  value: string
  trend: {
    direction: "up" | "down"
    change: string
    color: string
  }
  topIssue: string
  iconName: string // <-- add this
  iconContainerClass: string
  iconClass: string
  headerClass: string
  drillDownDetails: {
    rootCauses: { cause: string; impact: string; dataPoint?: string; severity?: "High" | "Medium" | "Low" }[]
    historicalPerformance: { period: string; value: string; change?: string; benchmark?: string }[]
    keyMetrics: { metric: string; value: string; benchmark?: string; status?: "good" | "warning" | "critical" }[]
    recommendedActions: string[]
  }
}

export interface ScriptAdherenceItem {
  id: string
  product: string
  adherenceScore: number
  trend: {
    direction: "up" | "down" | "stable"
    change: string
    color: string
  }
  topMissedArea: string
  drillDownDetails: {
    keyMissedPoints: { point: string; frequency: string; impact?: string; examples?: string[] }[]
    keyStrengths: { point: string; examples?: string[] }[]
    commonAgentFeedback?: string[]
    impactOfNonAdherence?: { area: string; description: string; severity?: "High" | "Medium" | "Low" }[]
    recommendedScriptUpdates?: string[]
    trainingFocusAreas?: string[]
  }
}

export interface CallMentionDetail {
  callId: string
  callDate: string
  agentName: string
  customerIdentifier: string
  mentionSnippet: string
}
