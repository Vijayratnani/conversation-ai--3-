import type { CallMentionDetail } from "@/types/dashboardTypes" // Replace with correct path

export const generateMockMentions = (
  count: number,
  topic: string, 
  callIdPrefix: string
): CallMentionDetail[] => {
  const mentions: CallMentionDetail[] = []
  const agents = ["عالیہ", "بشیر", "چاندنی", "داؤد"]
  const snippets = [
    `... میں ${topic} کے بارے میں پوچھنا چاہتا/چاہتی ہوں ...`,
    `... کیا آپ ${topic} پر کوئی نئی معلومات دے سکتے ہیں؟ ...`,
    `... میں نے ${topic} کے بارے میں سنا ہے، کیا یہ سچ ہے؟ ...`,
    `... مجھے ${topic} کے ساتھ ایک مسئلہ درپیش ہے۔ ...`,
  ]

  for (let i = 1; i <= count; i++) {
    mentions.push({
      callId: `${callIdPrefix}-${100 + i}`,
      callDate: `2024-07-${Math.floor(Math.random() * 10) + 20}`,
      agentName: agents[i % agents.length],
      customerIdentifier: `Cust-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      mentionSnippet: snippets[i % snippets.length],
    })
  }

  return mentions
}
