import type { LucideIcon } from "lucide-react"

export interface CallMentionDetail {
  callId: string
  callDate: string
  agentName: string
  customerIdentifier: string // e.g., masked phone number or ID
  mentionSnippet: string // The actual text snippet where the topic was mentioned
}

export interface TranscriptTag {
  type: "compliance" | "sentiment" | "topic" | "action" | "info" | "security" | "error"
  text: string
  icon?: LucideIcon
  variant?: "default" | "secondary" | "destructive" | "outline"
  className?: string
}

export interface TranscriptEntry {
  id: string
  speaker: "Agent" | "Customer"
  speakerName: string
  timestamp: string
  originalText: string
  translatedText?: string
  tags?: TranscriptTag[]
  isSensitive?: boolean
  sensitivePlaceholder?: string
}

export interface Call {
  id: string
  date: string
  time: string
  duration: string
  direction: string
  caller: string
  agent: string
  outcome: string
  customerSentiment: string
  agentSentiment: string
  flagged: boolean
  notes: string
  tags: string[]
  // Detailed fields for the dialog
  agentTalkTime?: number
  silenceDuration?: number
  interruptions?: number
  complianceScore?: number
  keyTopics?: Record<string, number>
  clientId?: string
  nextAction?: string
  containsSensitiveInfoOverall?: boolean
  transcriptAvailable?: boolean
  transcriptEntries?: TranscriptEntry[]
}

// Types from the main dashboard page, can be centralized here too
export interface ProductKnowledgeItem {
  product: string
  mentions: number
  positive: number
  negative: number
}

export interface ProductStatItem {
  name: string
  mentions: number
  trend: number
}

export interface ScriptAdherenceItem {
  agent: string
  score: number
  trend: number
}
