// data/growthData.ts
import { CallMentionDetail } from "@/types" // adjust the import path as needed
import { generateMockMentions } from "@/lib/generateMockMentions" // adjust this path if your generator is elsewhere

export const growthOpportunities = [
  {
    id: "mortgage-refi",
    topic: "Mortgage refinancing interest",
    topicUrdu: "مارگیج ری فنانسنگ سود",
    mentions: 32,
    trend: "+15%", 
  },
  {
    id: "investment-inq",
    topic: "Investment advisory inquiries",
    topicUrdu: "سرمایہ کاری مشاورتی پوچھ گچھ",
    mentions: 28,
    trend: "+10%",
  },
  {
    id: "mobile-feat",
    topic: "Mobile banking feature requests",
    topicUrdu: "موبائل بینکنگ فیچر کی درخواستیں",
    mentions: 24,
    trend: "+5%",
  },
]

export const mockMentionsData: Record<string, CallMentionDetail[]> = {
  "Mortgage refinancing interest": generateMockMentions(32, "مارگیج ری فنانسنگ سود", "MORT"),
  "Investment advisory inquiries": generateMockMentions(28, "سرمایہ کاری مشاورتی پوچھ گچھ", "INV"),
  "Mobile banking feature requests": generateMockMentions(24, "موبائل بینکنگ فیچر کی درخواستیں", "MOB"),
}
