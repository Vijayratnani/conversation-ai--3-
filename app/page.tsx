"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Headphones,
  Package,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  ListChecks,
  History,
  ClipboardCheck,
  Lightbulb,
  type LucideIcon,
  ArrowRight,
  Play,
  Pause,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AdvancedChatBot } from "@/components/advanced-chat-bot"
import { TopicCallListDialog } from "@/components/topic-call-list-dialog"
import type { CallMentionDetail } from "@/types"

// Define a more specific type for product knowledge items
interface ProductKnowledgeItem {
  product: string
  score: number
  issues: string
  color: string
  specificExamples?: string[]
  recommendedTraining?: { title: string; link?: string }[]
  scoreTrend?: { period: string; change: string; direction: "up" | "down" | "stable" }
  actionableSteps?: string[]
}

// Define a type for Product Stat items including drill-down details
// Define a type for Product Stat items including drill-down details
interface ProductStatItem {
  id: string
  title: string
  value: string
  trend: {
    direction: "up" | "down"
    change: string
    color: string
  }
  topIssue: string
  IconComponent: LucideIcon
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

// Define a type for Script Adherence items including drill-down details
interface ScriptAdherenceItem {
  id: string
  product: string
  adherenceScore: number
  trend: {
    direction: "up" | "down" | "stable"
    change: string // e.g., "+2% MoM"
    color: string // e.g., "text-green-500"
  }
  topMissedArea: string // A summary of the most common missed point
  drillDownDetails: {
    keyMissedPoints: { point: string; frequency: string; impact?: string; examples?: string[] }[]
    keyStrengths: { point: string; examples?: string[] }[]
    commonAgentFeedback?: string[]
    impactOfNonAdherence?: { area: string; description: string; severity?: "High" | "Medium" | "Low" }[]
    recommendedScriptUpdates?: string[]
    trainingFocusAreas?: string[]
  }
}

// Helper function to generate mock data
const generateMockMentions = (count: number, topic: string, callIdPrefix: string): CallMentionDetail[] => {
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

export default function Dashboard() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const [selectedSentimentItem, setSelectedSentimentItem] = useState<any>(null)
  const [isSentimentDetailDialogOpen, setIsSentimentDetailDialogOpen] = useState(false)

  const [selectedKnowledgeItem, setSelectedKnowledgeItem] = useState<ProductKnowledgeItem | null>(null)
  const [isKnowledgeDetailDialogOpen, setIsKnowledgeDetailDialogOpen] = useState(false)

  const [selectedProductStat, setSelectedProductStat] = useState<ProductStatItem | null>(null)
  const [isProductStatDetailDialogOpen, setIsProductStatDetailDialogOpen] = useState(false)

  const [selectedScriptAdherenceItem, setSelectedScriptAdherenceItem] = useState<ScriptAdherenceItem | null>(null)
  const [isScriptAdherenceDetailDialogOpen, setIsScriptAdherenceDetailDialogOpen] = useState(false)

  const [isGrowthOpportunityDetailDialogOpen, setIsGrowthOpportunityDetailDialogOpen] = useState(false)
  const [selectedGrowthOpportunityTopic, setSelectedGrowthOpportunityTopic] = useState<string | null>(null)
  const [selectedGrowthOpportunityTopicUrdu, setSelectedGrowthOpportunityTopicUrdu] = useState<string | null>(null)

  const [currentTopicMentions, setCurrentTopicMentions] = useState<CallMentionDetail[]>([])
  // You'll need a state for the CallDetailsDialog if it's opened from TopicCallListDialog
  const [isCallDetailDialogOpen, setIsCallDetailDialogOpen] = useState(false)
  const [selectedCallForDetail, setSelectedCallForDetail] = useState<any | null>(null) // Use your actual Call type

  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const audioRefs = {
    "dog-barking": useRef<HTMLAudioElement>(null),
    "cafe-chatter": useRef<HTMLAudioElement>(null),
  }

  const togglePlay = (audioType: keyof typeof audioRefs) => {
    // Pause any other playing audio
    Object.entries(audioRefs).forEach(([key, ref]) => {
      if (key !== audioType && ref.current && !ref.current.paused) {
        ref.current.pause()
        ref.current.currentTime = 0
      }
    })

    const audio = audioRefs[audioType].current
    if (audio) {
      if (audio.paused) {
        audio.play()
        setPlayingAudio(audioType)
      } else {
        audio.pause()
        audio.currentTime = 0
        setPlayingAudio(null)
      }
    }
  }

  useEffect(() => {
    const handleAudioEnd = (event: Event) => {
      setPlayingAudio(null)
    }

    const dogAudio = audioRefs["dog-barking"].current
    const cafeAudio = audioRefs["cafe-chatter"].current

    dogAudio?.addEventListener("ended", handleAudioEnd)
    cafeAudio?.addEventListener("ended", handleAudioEnd)

    return () => {
      dogAudio?.removeEventListener("ended", handleAudioEnd)
      cafeAudio?.removeEventListener("ended", handleAudioEnd)
    }
  }, [])

  const growthOpportunities = [
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

  const mockMentionsData: Record<string, CallMentionDetail[]> = {
    "Mortgage refinancing interest": generateMockMentions(32, "مارگیج ری فنانسنگ سود", "MORT"),
    "Investment advisory inquiries": generateMockMentions(28, "سرمایہ کاری مشاورتی پوچھ گچھ", "INV"),
    "Mobile banking feature requests": generateMockMentions(24, "موبائل بینکنگ فیچر کی درخواستیں", "MOB"),
  }

  const productKnowledgeLevels: ProductKnowledgeItem[] = [
    {
      product: "Credit Cards",
      score: 87,
      issues: "Minor hesitation on premium features",
      color: "bg-green-500",
      specificExamples: [
        "Agent paused when asked about annual fee waivers for XYZ card.",
        "Uncertainty regarding bonus point calculation for international spending.",
      ],
      recommendedTraining: [
        { title: "Premium Credit Card Features (Refresher)", link: "#" },
        { title: "Handling Complex Fee Enquiries", link: "#" },
      ],
      scoreTrend: { period: "last month", change: "+3%", direction: "up" },
      actionableSteps: ["Review product sheet for XYZ card.", "Shadow a senior agent handling premium card queries."],
    },
    {
      product: "Personal Loans",
      score: 72,
      issues: "Incomplete information on eligibility criteria",
      color: "bg-amber-500",
      specificExamples: [
        "Could not clearly state the minimum income requirement.",
        "Unsure about documentation for self-employed applicants.",
      ],
      recommendedTraining: [
        { title: "Personal Loan Eligibility Masterclass", link: "#" },
        { title: "Documentation Standards for Loans", link: "#" },
      ],
      scoreTrend: { period: "last month", change: "-2%", direction: "down" },
      actionableSteps: [
        "Study the latest eligibility matrix.",
        "Role-play scenarios involving different applicant profiles.",
      ],
    },
    {
      product: "Investment Products",
      score: 64,
      issues: "Significant knowledge gaps on returns calculation",
      color: "bg-red-500",
      specificExamples: [
        "Unable to explain how compound interest is calculated for product A.",
        "Confused risk disclaimers with return guarantees.",
      ],
      recommendedTraining: [
        { title: "Understanding Investment Returns & Risks", link: "#" },
        { title: "Compliance in Investment Advisory", link: "#" },
      ],
      scoreTrend: { period: "last month", change: "+1%", direction: "up" },
      actionableSteps: [
        "Complete the mandatory 'Investment Basics' e-learning.",
        "Seek clarification from the investments specialist team on return calculations.",
      ],
    },
  ]

  const productStats: ProductStatItem[] = [
    {
      id: "credit-cards",
      title: "Credit Cards",
      value: "42%",
      trend: { direction: "up", change: "+8% from last month", color: "text-red-500" },
      topIssue: "Transaction disputes",
      IconComponent: FileText,
      iconContainerClass: "bg-red-100",
      iconClass: "text-red-500",
      headerClass: "bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10",
      drillDownDetails: {
        rootCauses: [
          {
            cause: "Increased Sophisticated Phishing Scams",
            impact: "Higher volume of unauthorized transaction reports, particularly card-not-present fraud.",
            dataPoint: "15% increase in reported CNP fraud MoM; 25% of disputes linked to recent phishing campaigns.",
            severity: "High",
          },
          {
            cause: "System Integration Glitch with Payment Gateway X (Resolved)",
            impact:
              "Led to a spike in duplicate charge reports for transactions processed between 10th-12th last month. Primarily affected online retail transactions.",
            dataPoint: "3 major incidents, 1500+ customers affected. System patched on 13th.",
            severity: "Medium",
          },
          {
            cause: "Confusing Merchant Return/Refund Policies",
            impact:
              "Customers disputing charges after unsuccessful or lengthy return processes with specific online retailers (e.g., 'FashionFast', 'GadgetHub').",
            dataPoint: "Disputes related to merchant policies up 5% QoQ.",
            severity: "Low",
          },
          {
            cause: "First-Time User Errors with Contactless Payments",
            impact:
              "Minor disputes arising from misunderstanding contactless limits or accidental taps, especially among newly issued cards.",
            dataPoint: "Observed in 5% of new cardholder disputes.",
            severity: "Low",
          },
        ],
        historicalPerformance: [
          { period: "Current Month (to date)", value: "42%" },
          { period: "Last Month", value: "34%", change: "+8pp" },
          { period: "Two Months Ago", value: "30%", change: "+4pp" },
          { period: "Three Months Ago", value: "28%", change: "+2pp" },
          { period: "Year Ago (Same Month)", value: "25%", change: "+17pp YoY" },
        ],
        keyMetrics: [
          {
            metric: "Dispute Resolution Time (Avg)",
            value: "5.2 days",
            benchmark: "Industry Avg: 4.5 days",
            status: "warning",
          },
          {
            metric: "Successful Dispute Rate (for customer)",
            value: "78%",
            benchmark: "Target: 85%",
            status: "critical",
          },
          { metric: "Chargeback Rate", value: "0.85%", benchmark: "Industry Target: <0.5%", status: "critical" },
          { metric: "Fraud Loss per Active Account", value: "$2.15", benchmark: "Target: <$1.50", status: "warning" },
          {
            metric: "Customer Satisfaction (Post-Dispute)",
            value: "3.5/5",
            benchmark: "Target: 4.2/5",
            status: "warning",
          },
        ],
        recommendedActions: [
          "Implement real-time transaction monitoring with AI-driven anomaly detection, focusing on CNP and new phishing patterns.",
          "Conduct a full post-mortem on Payment Gateway X integration; establish stricter regression testing for gateway updates.",
          "Develop a standardized merchant dispute resolution guide for agents and FAQs for customers regarding policies of high-volume merchants.",
          "Enhance onboarding materials for new cardholders with clearer instructions on contactless payment usage and limits.",
          "Launch a targeted agent training program on handling complex dispute scenarios and de-escalation techniques.",
        ],
      },
    },
    {
      id: "personal-loans",
      title: "Personal Loans",
      value: "35%",
      trend: { direction: "up", change: "+5% from last month", color: "text-red-500" },
      topIssue: "Application delays",
      IconComponent: Package,
      iconContainerClass: "bg-amber-100",
      iconClass: "text-amber-500",
      headerClass: "bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10",
      drillDownDetails: {
        rootCauses: [
          {
            cause: "Manual Document Verification Bottleneck for Self-Employed Applicants",
            impact:
              "Significant delays in processing applications requiring non-standard income proof (e.g., bank statements, tax returns for gig workers).",
            dataPoint: "Avg. 3 additional days for verification for self-employed vs. salaried.",
            severity: "High",
          },
          {
            cause: "Understaffing in Underwriting Team During Peak Season",
            impact:
              "Queue of applications awaiting review exceeding 48-hour SLA. Increased agent overtime and potential for errors.",
            dataPoint: "Current backlog: 75 applications > 48hrs.",
            severity: "Medium",
          },
          {
            cause: "Incomplete Applicant Submissions (Address Proof & Income Details)",
            impact:
              "High rate of back-and-forth communication causing delays and customer frustration. Common issues: outdated address proof, unclear income statements.",
            dataPoint: "22% of applications require follow-up for missing/unclear documents.",
            severity: "Medium",
          },
          {
            cause: "System Latency in Credit Bureau Report Retrieval",
            impact: "Intermittent delays (up to 30 mins) in fetching credit reports, pausing application processing.",
            dataPoint: "Reported 5 times in the last week.",
            severity: "Low",
          },
        ],
        historicalPerformance: [
          { period: "Current Month (to date)", value: "35%" },
          { period: "Last Month", value: "30%", change: "+5pp" },
          { period: "Two Months Ago", value: "28%", change: "+2pp" },
          { period: "Three Months Ago", value: "29%", change: "-1pp" },
          { period: "Application Volume", value: "Increased 15% MoM" },
        ],
        keyMetrics: [
          {
            metric: "Avg. Application Processing Time (End-to-End)",
            value: "7.1 days",
            benchmark: "Target: 4 days",
            status: "critical",
          },
          {
            metric: "Time from Submission to Initial Review",
            value: "2.5 days",
            benchmark: "Target: 1 day",
            status: "warning",
          },
          { metric: "Approval Rate (Overall)", value: "65%", benchmark: "Target: 70%", status: "warning" },
          {
            metric: "Pull-through Rate (Approved to Funded)",
            value: "85%",
            benchmark: "Target: 90%",
            status: "warning",
          },
          { metric: "Application Abandonment Rate", value: "12%", benchmark: "Target: <8%", status: "warning" },
        ],
        recommendedActions: [
          "Pilot OCR technology and AI-powered validation for automated data extraction from income documents of self-employed applicants.",
          "Develop a flexible staffing model for underwriting, utilizing temporary staff or cross-training from other departments during peak loan seasons.",
          "Redesign online application form with dynamic fields, real-time validation, and clear checklists for required documents (with examples).",
          "Investigate and resolve system latency issues with credit bureau report retrieval; explore alternative/backup providers.",
          "Implement proactive communication to applicants regarding expected timelines and application status updates.",
        ],
      },
    },
    {
      id: "savings-accounts",
      title: "Savings Accounts",
      value: "28%",
      trend: { direction: "down", change: "-3% from last month", color: "text-green-500" },
      topIssue: "Interest rate concerns",
      IconComponent: BarChart3,
      iconContainerClass: "bg-blue-100",
      iconClass: "text-blue-500",
      headerClass: "bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10",
      drillDownDetails: {
        rootCauses: [
          {
            cause: "Aggressive Interest Rate Offers from Online-Only Competitors",
            impact:
              "Customers frequently inquiring about matching competitor rates (e.g., 'NeoBank Savings', 'FinTech Earn') or threatening to move funds.",
            dataPoint: "Competitor mentions up 20% in related calls.",
            severity: "High",
          },
          {
            cause: "Lack of Clarity on Tiered Interest Structure & APY Calculation",
            impact:
              "Confusion leading to dissatisfaction when expected interest isn't credited. Customers find thresholds and calculation methods opaque.",
            dataPoint: "15% of rate-related calls involve APY calculation queries.",
            severity: "Medium",
          },
          {
            cause: "Low Perceived Value of Associated Benefits/Perks",
            impact:
              "Customers not seeing enough differentiation beyond interest rates (e.g., ATM fee rebates, linked account benefits not well understood or valued).",
            severity: "Medium",
          },
          {
            cause: "Recent Decrease in Promotional Campaign Effectiveness",
            impact: "Fewer new account openings from recent marketing pushes compared to previous campaigns.",
            dataPoint: "Conversion rate from 'Summer Savings Drive' 10% lower than 'Spring Growth Offer'.",
            severity: "Low",
          },
        ],
        historicalPerformance: [
          { period: "Current Month (to date)", value: "28%" },
          { period: "Last Month", value: "31%", change: "-3pp" },
          { period: "Two Months Ago", value: "30%", change: "+1pp" },
          { period: "Account Opening Rate", value: "-5% MoM" },
          { period: "Account Closing Rate", value: "+2% MoM" },
        ],
        keyMetrics: [
          { metric: "Customer Retention Rate (Savings)", value: "92%", benchmark: "Target: 95%", status: "warning" },
          {
            metric: "Avg. Account Balance Trend",
            value: "$5,200 (declining -1.5% MoM)",
            benchmark: "Target: Stable or Growing",
            status: "warning",
          },
          {
            metric: "Net New Money (Savings)",
            value: "-$1.2M last month",
            benchmark: "Target: Positive inflow",
            status: "critical",
          },
          {
            metric: "Customer Lifetime Value (Savings Segment)",
            value: "$450",
            benchmark: "Target: $550",
            status: "warning",
          },
          { metric: "Calls per Account (Rate-related)", value: "0.15", benchmark: "Target: <0.10", status: "warning" },
        ],
        recommendedActions: [
          "Conduct bi-weekly competitor rate analysis and develop a tiered response strategy, including targeted retention offers for high-value customers.",
          "Create interactive online calculators and explainer videos for tiered interest structures and APY calculations; train agents on clear explanations.",
          "Survey customers to identify desired perks for savings accounts; explore partnerships for value-added services (e.g., financial planning tools).",
          "Analyze and A/B test new promotional campaign messaging and channels to improve acquisition rates.",
          "Empower frontline agents with pre-approved retention offers for customers citing competitor rates.",
        ],
      },
    },
    {
      id: "mortgages",
      title: "Mortgages",
      value: "22%",
      trend: { direction: "up", change: "+2% from last month", color: "text-red-500" },
      topIssue: "Refinancing questions",
      IconComponent: Headphones,
      iconContainerClass: "bg-green-100",
      iconClass: "text-green-500",
      headerClass: "bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10",
      drillDownDetails: {
        rootCauses: [
          {
            cause: "Fluctuating Market Interest Rates & Media Speculation",
            impact:
              "Increased customer inquiries about potential benefits and timing of refinancing, driven by economic news.",
            dataPoint: "Refinancing inquiry calls up 30% following central bank announcements.",
            severity: "High",
          },
          {
            cause: "Complex Refinancing Process & Documentation Requirements",
            impact:
              "Customers seeking clarification on eligibility, required paperwork (e.g., appraisals, income verification), and timelines. High effort perceived.",
            dataPoint: "Avg. call length for refinancing queries: 12 mins (vs. 7 mins for other mortgage calls).",
            severity: "Medium",
          },
          {
            cause: "Lack of Proactive Communication During Underwriting for Refinance",
            impact: "Customers feeling uninformed about status, leading to repeat calls and anxiety.",
            severity: "Medium",
          },
          {
            cause: "Agent Unfamiliarity with Niche Refinancing Products (e.g., Cash-out Refi)",
            impact:
              "Incorrect or incomplete information provided, leading to follow-up calls or specialist escalations.",
            dataPoint: "10% of refinancing calls escalated for specialist advice.",
            severity: "Low",
          },
        ],
        historicalPerformance: [
          { period: "Current Month (to date)", value: "22%" },
          { period: "Last Month", value: "20%", change: "+2pp" },
          { period: "Refinance Application Volume", value: "+18% MoM" },
          { period: "Refinance Inquiry Call Volume", value: "+25% MoM" },
        ],
        keyMetrics: [
          {
            metric: "Refinance Application Conversion Rate (Inquiry to App)",
            value: "40%",
            benchmark: "Target: 55%",
            status: "warning",
          },
          { metric: "Time to Close (Refinance)", value: "48 days", benchmark: "Target: 35 days", status: "critical" },
          {
            metric: "Customer Effort Score (Refinancing Process)",
            value: "3.2/5 (High Effort)",
            benchmark: "Target: >4/5 (Low Effort)",
            status: "warning",
          },
          {
            metric: "Pull-Through Rate (Refi Approved to Closed)",
            value: "75%",
            benchmark: "Target: 85%",
            status: "warning",
          },
        ],
        recommendedActions: [
          "Provide proactive communication (e.g., email, website banners) on market rate changes and their potential impact on refinancing decisions.",
          "Develop a simplified online refinancing eligibility checker and a clear, step-by-step guide with document checklists.",
          "Implement automated status updates for refinance applicants at key milestones (application received, underwriting, appraisal, approval).",
          "Conduct targeted training for agents on various refinancing products, including scenario-based role-playing.",
          "Offer personalized refinancing consultations with mortgage specialists, potentially via video call.",
        ],
      },
    },
    {
      id: "investment-products",
      title: "Investment Products",
      value: "18%",
      trend: { direction: "up", change: "+4% from last month", color: "text-red-500" },
      topIssue: "Performance concerns",
      IconComponent: Package,
      iconContainerClass: "bg-purple-100",
      iconClass: "text-purple-500",
      headerClass: "bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10",
      drillDownDetails: {
        rootCauses: [
          {
            cause: "Recent Market Volatility Impacting Short-Term Returns (esp. Tech & Growth Stocks)",
            impact:
              "Customers concerned about portfolio performance, particularly those with higher-risk allocations or shorter investment horizons.",
            dataPoint: "Performance-related calls up 35% for portfolios with >60% equity.",
            severity: "High",
          },
          {
            cause: "Misalignment of Client Risk Profile and Product Suitability",
            impact:
              "Some clients in products too aggressive for their stated risk tolerance, leading to anxiety during downturns. Initial risk assessment may be outdated.",
            dataPoint: "Review found 8% of clients in 'Aggressive Growth' funds have 'Conservative' risk profiles.",
            severity: "Medium",
          },
          {
            cause: "Insufficient Agent Training on Explaining Complex Investment Products & Market Fluctuations",
            impact:
              "Agents struggling to reassure clients or clearly articulate long-term strategies versus short-term volatility.",
            severity: "Medium",
          },
          {
            cause: "Unclear Fee Structures for Certain Managed Funds",
            impact: "Clients questioning management fees, especially when performance is lagging.",
            dataPoint: "Fee-related queries constitute 10% of investment calls.",
            severity: "Low",
          },
        ],
        historicalPerformance: [
          { period: "Current Month (to date)", value: "18%" },
          { period: "Last Month", value: "14%", change: "+4pp" },
          { period: "Client Portfolio Growth (Avg. QTD)", value: "1.2%", benchmark: "S&P 500 QTD: 2.1%" },   
          { period: "Net Fund Inflow/Outflow", value: "-$0.8M last month" },
        ],
        keyMetrics: [
          {
            metric: "Client Satisfaction with Investment Advisor/Support",
            value: "3.9/5",
            benchmark: "Target: 4.5/5",
            status: "warning",
          },
          {
            metric: "Number of Complaints (Performance-related)",
            value: "25 last month",
            benchmark: "Target: <10",
            status: "critical",
          },
          {
            metric: "Client Retention Rate (Investment Segment)",
            value: "90%",
            benchmark: "Target: 94%",
            status: "warning",
          },
          {
            metric: "Percentage of Clients with Annual Portfolio Review",
            value: "60%",
            benchmark: "Target: 90%",
            status: "warning",
          },
          {
            metric: "Understanding of Risk (Client Survey)",
            value: "65% report full understanding",
            benchmark: "Target: 80%",
            status: "warning",
          },
        ],
        recommendedActions: [
          "Schedule proactive portfolio reviews for clients in high-volatility products or those whose portfolios have underperformed benchmarks significantly.",
          "Mandate annual risk profile reassessment for all investment clients and ensure product holdings align with current tolerance.",
          "Develop advanced training modules for agents on communicating risk, managing client expectations during market downturns, and explaining long-term investment principles.",
          "Create transparent, easy-to-understand documentation on fee structures for all investment products and make it readily available.",
          "Launch educational webinars/content on navigating market volatility and the importance of diversified, long-term investment strategies.",
        ],
      },
    },
  ]

  const scriptAdherenceData: ScriptAdherenceItem[] = [
    {
      id: "credit-cards-adherence",
      product: "Credit Cards",
      adherenceScore: 92,
      trend: { direction: "up", change: "+2% MoM", color: "text-green-500" },
      topMissedArea: "Benefits explanation for premium cards",
      drillDownDetails: {
        keyMissedPoints: [
          {
            point: "Explaining travel insurance coverage details",
            frequency: "15% of calls",
            impact: "Customer confusion, potential dissatisfaction if benefits misunderstood.",
            examples: [
              "Agent A: 'It has travel insurance.' (Too vague)",
              "Agent B: 'I think it covers lost luggage.' (Uncertain)",
            ],
          },
          {
            point: "Mentioning specific bonus point categories",
            frequency: "10% of calls",
            impact: "Missed opportunity to highlight value, customer may not maximize rewards.",
          },
          {
            point: "Required compliance disclosure (Reg Z)",
            frequency: "3% of calls",
            impact: "Compliance risk, potential fines.",
            examples: ["Forgot to state APR range clearly."],
          },
        ],
        keyStrengths: [
          { point: "Greeting and call opening", examples: ["Consistently polite and professional openings observed."] },
          { point: "Security verification process", examples: ["Agents follow protocol accurately."] },
        ],
        commonAgentFeedback: [
          "Script for premium benefits is too long.",
          "Unsure how to handle questions about competitor card benefits.",
        ],
        impactOfNonAdherence: [
          { area: "Customer Understanding", description: "Reduced clarity on product value.", severity: "Medium" },
          { area: "Compliance", description: "Minor risk of non-compliance on specific disclosures.", severity: "Low" },
          {
            area: "Sales Opportunity",
            description: "Potential missed cross-sell/upsell if benefits not clear.",
            severity: "Medium",
          },
        ],
        recommendedScriptUpdates: [
          "Create concise bullet points for premium card benefits.",
          "Add a section on how to politely redirect competitor comparisons.",
        ],
        trainingFocusAreas: [
          "Role-playing benefit explanations for premium cards.",
          "Refresher on Reg Z disclosure requirements.",
        ],
      },
    },
    {
      id: "personal-loans-adherence",
      product: "Personal Loans",
      adherenceScore: 88,
      trend: { direction: "stable", change: "0% MoM", color: "text-amber-500" },
      topMissedArea: "Terms & conditions, specifically prepayment penalties",
      drillDownDetails: {
        keyMissedPoints: [
          {
            point: "Explaining prepayment penalty clause",
            frequency: "18% of calls",
            impact: "Customer dissatisfaction if penalized unexpectedly.",
            examples: ["Agent C: 'You can pay it off early, no problem.' (Incorrect/Incomplete)"],
          },
          {
            point: "Clearly stating all applicable fees (origination, late)",
            frequency: "12% of calls",
            impact: "Lack of transparency, potential complaints.",
          },
        ],
        keyStrengths: [
          { point: "Explaining loan application process steps." },
          { point: "Empathy and active listening during eligibility discussions." },
        ],
        impactOfNonAdherence: [
          { area: "Customer Trust", description: "Erosion of trust if key terms are omitted.", severity: "High" },
          {
            area: "Complaints",
            description: "Increased likelihood of formal complaints regarding fees/penalties.",
            severity: "Medium",
          },
        ],
        recommendedScriptUpdates: [
          "Add a mandatory checklist item for prepayment penalty disclosure.",
          "Use a fee summary table in the script for easy reference.",
        ],
        trainingFocusAreas: ["Understanding and explaining loan T&Cs.", "Handling objections related to fees."],
      },
    },
    {
      id: "savings-accounts-adherence",
      product: "Savings Accounts",
      adherenceScore: 95,
      trend: { direction: "up", change: "+1% MoM", color: "text-green-500" },
      topMissedArea: "None significant; high overall adherence",
      drillDownDetails: {
        keyMissedPoints: [
          {
            point: "Proactively mentioning online banking features",
            frequency: "5% of calls",
            impact: "Minor missed opportunity to reinforce convenience.",
          },
        ],
        keyStrengths: [
          { point: "Clear explanation of account types and minimum balances." },
          { point: "Accurate information on current interest rates." },
        ],
        commonAgentFeedback: ["Script is straightforward and easy to follow."],
        impactOfNonAdherence: [
          {
            area: "Customer Engagement",
            description: "Slightly lower engagement with digital tools if not highlighted.",
            severity: "Low",
          },
        ],
        recommendedScriptUpdates: ["Consider adding a soft prompt for online banking feature awareness."],
        trainingFocusAreas: ["Maintaining high standards, sharing best practices from top performers."],
      },
    },
    {
      id: "mortgages-adherence",
      product: "Mortgages",
      adherenceScore: 79,
      trend: { direction: "down", change: "-3% MoM", color: "text-red-500" },
      topMissedArea: "Rate comparison details and closing cost estimation",
      drillDownDetails: {
        keyMissedPoints: [
          {
            point: "Providing accurate range for closing costs",
            frequency: "25% of calls",
            impact: "Customer surprise at actual costs, potential for deal to fall through.",
            examples: ["Agent D: 'Closing costs are usually a few thousand.' (Too vague)"],
          },
          {
            point: "Explaining difference between APR and interest rate",
            frequency: "20% of calls",
            impact: "Customer confusion, difficulty comparing offers.",
          },
          {
            point: "Required RESPA disclosures",
            frequency: "8% of calls",
            impact: "Significant compliance risk.",
          },
        ],
        keyStrengths: [
          { point: "Building rapport with potential borrowers." },
          { point: "Gathering initial application information effectively." },
        ],
        impactOfNonAdherence: [
          { area: "Compliance", description: "High risk of RESPA violations.", severity: "High" },
          {
            area: "Customer Experience",
            description: "Negative experience due to unexpected costs or confusion.",
            severity: "High",
          },
          { area: "Conversion Rate", description: "Lower conversion from application to closing.", severity: "Medium" },
        ],
        recommendedScriptUpdates: [
          "Integrate a closing cost estimation tool/range directly into the script.",
          "Provide clear, simple language for explaining APR vs. interest rate.",
          "Add mandatory verbal confirmation for RESPA disclosures.",
        ],
        trainingFocusAreas: [
          "Mortgage compliance (RESPA).",
          "Explaining complex financial terms simply.",
          "Managing customer expectations on costs.",
        ],
      },
    },
  ]

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const handleKnowledgeItemClick = (item: ProductKnowledgeItem) => {
    setSelectedKnowledgeItem(item)
    setIsKnowledgeDetailDialogOpen(true)
  }

  const handleProductStatClick = (item: ProductStatItem) => {
    setSelectedProductStat(item)
    setIsProductStatDetailDialogOpen(true)
  }

  const handleScriptAdherenceClick = (item: ScriptAdherenceItem) => {
    setSelectedScriptAdherenceItem(item)
    setIsScriptAdherenceDetailDialogOpen(true)
  }

  const handleViewFullCallFromTopicList = (callId: string) => {
    // This is a placeholder for now.
    // In a real app, you would find the full call object and open the CallDetailsDialog.
    console.log(`View full details for call: ${callId}`)
    alert(`View full details for call: ${callId}`)
  }
  return (<>
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 subtle-pattern">
      <div className="flex items-center justify-end">
        <Badge variant="outline" className="glass-effect text-primary border-primary/30">
          Last updated: Today, 10:30 AM
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white/80 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
          <TabsTrigger value="overview" className="rounded-lg text-sm font-medium">
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-lg text-sm font-medium">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" className="rounded-lg text-sm font-medium">
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Product Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {productStats.map((stat) => (
              <Card
                key={stat.id}
                className="stat-card card-enhanced overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-soft-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => handleProductStatClick(stat)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleProductStatClick(stat)
                }}
                aria-haspopup="dialog"
                aria-labelledby={`stat-title-${stat.id}`}
              >
                <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${stat.headerClass}`}>
                  <CardTitle id={`stat-title-${stat.id}`} className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`h-8 w-8 rounded-full ${stat.iconContainerClass} flex items-center justify-center shadow-inner`}
                  >
                    <stat.IconComponent className={`h-4 w-4 ${stat.iconClass}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center mt-1">
                    {stat.trend.direction === "up" ? (
                      <ArrowUpRight className={`h-4 w-4 ${stat.trend.color} mr-1`} />
                    ) : (
                      <ArrowDownRight className={`h-4 w-4 ${stat.trend.color} mr-1`} />
                    )}
                    <p className={`text-xs ${stat.trend.color} font-medium`}>{stat.trend.change}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Top issue: {stat.topIssue}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Agent KPIs Dashboard */}
          <Card className="card-enhanced glass-effect overflow-hidden border-0 shadow-soft-lg">
            <CardHeader className="pb-2 bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/10 border-b border-primary/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground/80">
                    Agent Stats
                  </CardTitle>
                  <CardDescription>Key performance indicators and knowledge metrics for all agents</CardDescription>
                </div>
                <Badge variant="outline" className="glass-effect text-primary border-primary/30">
                  37 Active Agents
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Agent Knowledge Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="col-span-1 md:col-span-3">
                    <div className="grid grid-cols-3 gap-4 h-full">
                      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 border border-green-100 dark:border-green-800/30 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                        <div>
                          <div className="text-3xl font-bold text-green-600 dark:text-green-400">12</div>
                          <div className="text-sm text-green-700 dark:text-green-300 font-medium">
                            Excellent Knowledge
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">90% or higher</div>
                        </div>
                        <div className="mt-2 flex items-center text-xs text-green-600">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          <span>+2 from last month</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 border border-amber-100 dark:border-amber-800/30 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                        <div>
                          <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">18</div>
                          <div className="text-sm text-amber-700 dark:text-amber-300 font-medium">Good Knowledge</div>
                          <div className="text-xs text-muted-foreground mt-1">75-89%</div>
                        </div>
                        <div className="mt-2 flex items-center text-xs text-amber-600">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          <span>+3 from last month</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 border border-red-100 dark:border-red-800/30 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                        <div>
                          <div className="text-3xl font-bold text-red-600 dark:text-red-400">7</div>
                          <div className="text-sm text-red-700 dark:text-red-300 font-medium">Needs Improvement</div>
                          <div className="text-xs text-muted-foreground mt-1">Below 75%</div>
                        </div>
                        <div className="mt-2 flex items-center text-xs text-red-600">
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                          <span>-2 from last month</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border border-blue-100 dark:border-blue-800/30 p-4 rounded-lg shadow-sm">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-800/30 mb-2">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">82%</div>
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                        Average Knowledge Score
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">+3% from last month</div>
                    </div>
                    <div className="mt-3">
                      <div className="text-xs text-muted-foreground mb-1">Knowledge Distribution</div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
                        <div className="h-full bg-green-500" style={{ width: "32%" }}></div>
                        <div className="h-full bg-amber-500" style={{ width: "49%" }}></div>
                        <div className="h-full bg-red-500" style={{ width: "19%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agent KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-muted/20 p-4 rounded-lg shadow-sm border border-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-muted-foreground">Avg. Call Quality</div>
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Headphones className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">86%</div>
                      <div className="flex items-center text-xs text-green-600 mt-1">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        <span>+2% from last month</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-muted/20 p-4 rounded-lg shadow-sm border border-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-muted-foreground">Script Adherence</div>
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">92%</div>
                      <div className="flex items-center text-xs text-green-600 mt-1">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        <span>+4% from last month</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-muted/20 p-4 rounded-lg shadow-sm border border-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-muted-foreground">Avg. Handle Time</div>
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <BarChart3 className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">5:24</div>
                      <div className="flex items-center text-xs text-green-600 mt-1">
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                        <span>-18s from last month</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-muted/20 p-4 rounded-lg shadow-sm border border-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-muted-foreground">Customer Satisfaction</div>
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">4.6/5</div>
                      <div className="flex items-center text-xs text-green-600 mt-1">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        <span>+0.2 from last month</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Performing Agents */}
                <div className="bg-white dark:bg-muted/20 p-4 rounded-lg shadow-sm border border-muted/50">
                  <h3 className="text-sm font-medium mb-3">Top Performing Agents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { name: "Sarah K.", score: 94, product: "Credit Cards", improvement: "+3%" },
                      { name: "Michael R.", score: 92, product: "Personal Loans", improvement: "+5%" },
                      { name: "Jessica T.", score: 91, product: "Savings Accounts", improvement: "+2%" },
                    ].map((agent) => (
                      <div key={agent.name} className="flex items-center gap-3 p-2 rounded-md bg-muted/30">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {agent.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{agent.name}</div>
                          <div className="text-xs text-muted-foreground">{agent.product} Specialist</div>
                          <div className="flex items-center text-xs text-green-600 mt-0.5">
                            <span className="font-medium mr-1">{agent.score}%</span>
                            <ArrowUpRight className="h-3 w-3 mr-0.5" />
                            <span>{agent.improvement}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Two-column layout for Sentiment Analysis and Sales Effectiveness */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-8 mt-6">
            <Card className="col-span-4 overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border-b border-blue-100/50">
                <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                  Sentiment Analysis by Product
                </CardTitle>
                <CardDescription>Customer sentiment breakdown and root cause analysis</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-md flex flex-col items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                  <div className="w-full h-full p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 bg-white/80 py-2 px-4 rounded-lg shadow-sm backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                          <span className="font-medium text-xs">Positive</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-300 rounded-full shadow-sm"></div>
                          <span className="font-medium text-xs">Neutral</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                          <span className="font-medium text-xs">Negative</span>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground bg-muted/30 py-1 px-2 rounded-md">Last 30 days</div>
                    </div>

                    <div className="grid gap-2">
                      {[
                        {
                          product: "Credit Cards",
                          positive: 25,
                          neutral: 30,
                          negative: 45,
                          warning: true,
                          causes: ["Hidden fees", "Interest rates", "Customer service"],
                        },
                        {
                          product: "Personal Loans",
                          positive: 40,
                          neutral: 35,
                          negative: 25,
                          warning: false,
                          causes: ["Application process", "Approval time"],
                        },
                        {
                          product: "Savings Accounts",
                          positive: 55,
                          neutral: 30,
                          negative: 15,
                          warning: false,
                          causes: ["Interest rates"],
                        },
                      ].map((item) => (
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

                    <div className="flex justify-between items-center mt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                            Show More Products
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Additional Products</DialogTitle>
                          </DialogHeader>

                          <div className="space-y-4 mt-2">
                            {[
                              {
                                product: "Mortgages",
                                positive: 30,
                                neutral: 25,
                                negative: 45,
                                warning: true,
                                causes: ["Processing delays", "Documentation", "Interest rates"],
                              },
                              {
                                product: "Investment Products",
                                positive: 45,
                                neutral: 30,
                                negative: 25,
                                warning: false,
                                causes: ["Performance concerns"],
                              },
                            ].map((item) => (
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
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-xs bg-transparent">
                            View All Analysis
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px]">
                          <DialogHeader>
                            <DialogTitle>Complete Sentiment Analysis</DialogTitle>
                          </DialogHeader>

                          <div className="space-y-4 mt-2 max-h-[70vh] overflow-y-auto pr-2">
                            {[
                              {
                                product: "Credit Cards",
                                positive: 25,
                                neutral: 30,
                                negative: 45,
                                warning: true,
                                causes: ["Hidden fees", "Interest rates", "Customer service"],
                              },
                              {
                                product: "Personal Loans",
                                positive: 40,
                                neutral: 35,
                                negative: 25,
                                warning: false,
                                causes: ["Application process", "Approval time"],
                              },
                              {
                                product: "Savings Accounts",
                                positive: 55,
                                neutral: 30,
                                negative: 15,
                                warning: false,
                                causes: ["Interest rates"],
                              },
                              {
                                product: "Mortgages",
                                positive: 30,
                                neutral: 25,
                                negative: 45,
                                warning: true,
                                causes: ["Processing delays", "Documentation", "Interest rates"],
                              },
                              {
                                product: "Investment Products",
                                positive: 45,
                                neutral: 30,
                                negative: 25,
                                warning: false,
                                causes: ["Performance concerns"],
                              },
                            ].map((item) => (
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
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedSentimentItem && (
              <Dialog open={isSentimentDetailDialogOpen} onOpenChange={setIsSentimentDetailDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      {selectedSentimentItem.product} Sentiment Analysis
                      {selectedSentimentItem.warning && (
                        <Badge variant="destructive" className="text-xs py-1">
                          ⚠️ Consistent Negative
                        </Badge>
                      )}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 mt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Sentiment Distribution</span>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>Positive</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                            <span>Neutral</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span>Negative</span>
                          </div>
                        </div>
                      </div>

                      <div className="h-4 w-full bg-muted rounded-full overflow-hidden flex">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${selectedSentimentItem.positive}%` }}
                        ></div>
                        <div
                          className="h-full bg-gray-300"
                          style={{ width: `${selectedSentimentItem.neutral}%` }}
                        ></div>
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${selectedSentimentItem.negative}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-green-600">{selectedSentimentItem.positive}% Positive</span>
                        <span className="font-medium text-gray-500">{selectedSentimentItem.neutral}% Neutral</span>
                        <span className="font-medium text-red-600">{selectedSentimentItem.negative}% Negative</span>
                      </div>
                    </div>

                    <div className="bg-muted/20 p-4 rounded-md">
                      <h4 className="text-sm font-semibold mb-2">Root Causes of Dissatisfaction</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSentimentItem.causes.map((cause: string) => (
                          <Badge key={cause} variant="outline" className="bg-white dark:bg-muted/30">
                            {cause}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="bg-muted/20 p-4 rounded-md">
                      <h4 className="text-sm font-semibold mb-2">Trend Analysis</h4>
                      <div className="flex items-center gap-2">
                        {selectedSentimentItem.warning ? (
                          <>
                            <ArrowUpRight className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-red-500">
                              Negative sentiment increasing over the past 3 months
                            </span>
                          </>
                        ) : (
                          <>
                            <ArrowDownRight className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-500">
                              Negative sentiment decreasing over the past 3 months
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="bg-muted/20 p-4 rounded-md">
                      <h4 className="text-sm font-semibold mb-2">Recommended Actions</h4>
                      <ul className="text-sm space-y-1 list-disc pl-4">
                        {selectedSentimentItem.warning ? (
                          <>
                            <li>Review customer feedback for specific pain points</li>
                            <li>Conduct targeted customer interviews</li>
                            <li>Develop action plan to address top issues</li>
                          </>
                        ) : (
                          <>
                            <li>Continue monitoring sentiment trends</li>
                            <li>Maintain current customer service approach</li>
                            <li>Share positive feedback with product teams</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            <Card className="col-span-4 card-hover shadow-md transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Sales & Cross-Sell Effectiveness</CardTitle>
                <CardDescription>Performance metrics for sales and cross-selling opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Successful Sales/Upgrades</h4>
                      <div className="text-2xl font-bold text-primary">24%</div>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "24%" }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">124 calls out of 517 resulted in a sale</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Cross-Sell Success Rate</h4>
                      <div className="text-2xl font-bold text-green-600">18%</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="bg-muted/30 p-2 rounded-md">
                        <div className="text-sm font-medium">Top Cross-Sell</div>
                        <div className="text-xs text-muted-foreground">Credit Card → Investment Products</div>
                        <div className="text-xs font-medium text-green-600 mt-1">32% success</div>
                      </div>
                      <div className="bg-muted/30 p-2 rounded-md">
                        <div className="text-sm font-medium">Lowest Cross-Sell</div>
                        <div className="text-xs text-muted-foreground">Mortgage → Personal Loans</div>
                        <div className="text-xs font-medium text-red-600 mt-1">8% success</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Missed Sales Opportunities</h4>
                      <div className="text-2xl font-bold text-amber-600">43</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-medium">Top Missed Keywords</span>
                        <span className="text-muted-foreground">Occurrence</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>&quot;better interest rate&quot;</span>
                          <span className="font-medium">17</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>&quot;comparing options&quot;</span>
                          <span className="font-medium">14</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>&quot;looking for alternatives&quot;</span>
                          <span className="font-medium">12</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Strategic Insights Dashboard */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-8 mt-6">
            <Card className="col-span-8 overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10 border-b border-indigo-100/50">
                <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">
                  Strategic Insights Dashboard
                </CardTitle>
                <CardDescription>Key metrics and signals from call center data (Last 30 days)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Risk Indicators</h4>
                      <Badge
                        variant="outline"
                        className="bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400"
                      >
                        3 High Priority
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="bg-muted/30 p-2 rounded-md border-l-2 border-red-500">
                        <div className="text-sm font-medium">Compliance Risk</div>
                        <div className="text-xs text-muted-foreground">Disclosure phrase missing in 18% of calls</div>
                        <div className="text-xs font-medium text-red-600 mt-1">↑ 4% from last month</div>
                      </div>
                      <div className="bg-muted/30 p-2 rounded-md border-l-2 border-amber-500">
                        <div className="text-sm font-medium">Customer Churn Risk</div>
                        <div className="text-xs text-muted-foreground">Competitor mentions up 12%</div>
                        <div className="text-xs font-medium text-amber-600 mt-1">High risk in Credit Cards</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Agent Performance</h4>
                      <div className="text-sm font-medium text-primary">78% Avg. Quality Score</div>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "78%" }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Top agent: Sarah K. (94%)</span>
                      <span>Needs coaching: 3 agents</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Growth Opportunities</h4>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400"
                      >
                        4 Identified
                      </Badge>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md">

                      <div className="space-y-2">
                        {growthOpportunities.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-xs">
                            <span className="font-medium">{item.topic}</span>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-xs p-0 h-auto text-green-600 hover:text-green-700"
                              onClick={() => {
                                setSelectedGrowthOpportunityTopic(item.topic)
                                setSelectedGrowthOpportunityTopicUrdu(item.topicUrdu)
                                setCurrentTopicMentions(mockMentionsData[item.topic] || [])
                                setIsGrowthOpportunityDetailDialogOpen(true)
                              }}
                              aria-haspopup="dialog"
                              aria-expanded={isGrowthOpportunityDetailDialogOpen && selectedGrowthOpportunityTopic === item.topic}
                            >
                              {item.mentions} mentions <ArrowRight className="h-3 w-3 ml-1 opacity-70" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Call Environment Analysis</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="bg-muted/30 p-3 rounded-md text-center flex flex-col justify-between">
                        <div>
                          <div className="text-xs text-muted-foreground">Background Noise: Dog Barking</div>
                          <div className="text-sm font-medium mt-1">Detected in 8% of calls</div>
                        </div>
                        <div className="mt-2">
                          <Button variant="outline" size="sm" onClick={() => togglePlay("dog-barking")}>
                            {playingAudio === "dog-barking" ? (
                              <Pause className="h-4 w-4 mr-2" />
                            ) : (
                              <Play className="h-4 w-4 mr-2" />
                            )}
                            Sample
                          </Button>
                        </div>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-md text-center flex flex-col justify-between">
                        <div>
                          <div className="text-xs text-muted-foreground">Background Noise: Cafe Chatter</div>
                          <div className="text-sm font-medium mt-1">Detected in 6% of calls</div>
                        </div>
                        <div className="mt-2">
                          <Button variant="outline" size="sm" onClick={() => togglePlay("cafe-chatter")}>
                            {playingAudio === "cafe-chatter" ? (
                              <Pause className="h-4 w-4 mr-2" />
                            ) : (
                              <Play className="h-4 w-4 mr-2" />
                            )}
                            Sample
                          </Button>
                        </div>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-md text-center flex flex-col justify-between">
                        <div>
                          <div className="text-xs text-muted-foreground">Avg. Hold Time</div>
                          <div className="text-sm font-medium mt-1">1m 42s</div>
                        </div>
                        <div className="text-xs text-green-600 mt-2">↓ 12s from last month</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product-Specific Agent Performance */}
          <Card className="card-hover shadow-md transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle>Product-Specific Agent Performance</CardTitle>
              <CardDescription>Detailed agent performance metrics by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3 flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                      Product Knowledge Level
                    </h3>
                    <div className="space-y-3">
                      {productKnowledgeLevels.map((item) => (
                        <div
                          key={item.product}
                          className="bg-white dark:bg-muted/20 p-3 rounded-md shadow-sm border border-muted/50 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleKnowledgeItemClick(item)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") handleKnowledgeItemClick(item)
                          }}
                          aria-haspopup="dialog"
                          aria-labelledby={`knowledge-item-${item.product}`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span id={`knowledge-item-${item.product}`} className="font-medium text-sm">
                              {item.product}
                            </span>
                            <span
                              className={`text-sm px-1.5 py-0.5 rounded-full ${item.score > 80
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : item.score > 70
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                }`}
                            >
                              {item.score}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-2">
                            <div className={`h-full ${item.color}`} style={{ width: `${item.score}%` }}></div>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.issues}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3 flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                      Script Adherence by Product
                    </h3>
                    <div className="bg-white dark:bg-muted/20 p-4 rounded-md shadow-sm border border-muted/50">
                      <div className="space-y-4">
                        {scriptAdherenceData.map((item) => (
                          <div
                            key={item.id}
                            className="space-y-1 cursor-pointer hover:bg-muted/30 p-2 rounded-md transition-colors"
                            onClick={() => handleScriptAdherenceClick(item)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") handleScriptAdherenceClick(item)
                            }}
                            aria-haspopup="dialog"
                            aria-labelledby={`adherence-item-${item.id}`}
                          >
                            <div className="flex items-center justify-between">
                              <span id={`adherence-item-${item.id}`} className="text-sm">
                                {item.product}
                              </span>
                              <div className="flex items-center">
                                <span
                                  className={`text-xs font-medium mr-2 ${item.adherenceScore > 90
                                    ? "text-green-600"
                                    : item.adherenceScore > 80
                                      ? "text-amber-600"
                                      : "text-red-600"
                                    }`}
                                >
                                  {item.adherenceScore}%
                                </span>
                                {item.trend.direction === "up" && (
                                  <ArrowUpRight className={`h-3 w-3 ${item.trend.color}`} />
                                )}
                                {item.trend.direction === "down" && (
                                  <ArrowDownRight className={`h-3 w-3 ${item.trend.color}`} />
                                )}
                              </div>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${item.adherenceScore > 90
                                  ? "bg-green-500"
                                  : item.adherenceScore > 80
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                                  }`}
                                style={{ width: `${item.adherenceScore}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {item.adherenceScore < 90 ? `Top Miss: ${item.topMissedArea}` : "Excellent adherence"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                    Average Handling Time by Product Type
                  </h3>
                  <div className="grid gap-3 md:grid-cols-4">
                    {[
                      { product: "Credit Cards", time: "4:32", trend: "down", percent: "8%" },
                      { product: "Personal Loans", time: "7:15", trend: "up", percent: "5%" },
                      { product: "Savings Accounts", time: "3:45", trend: "down", percent: "12%" },
                      { product: "Mortgages", time: "9:20", trend: "up", percent: "3%" },
                    ].map((item) => (
                      <div
                        key={item.product}
                        className="bg-white dark:bg-muted/20 p-4 rounded-md shadow-sm border border-muted/50 text-center"
                      >
                        <div className="text-sm font-medium">{item.product}</div>
                        <div className="text-2xl font-bold my-2">{item.time}</div>
                        <div
                          className={`text-xs flex items-center justify-center ${item.trend === "down" ? "text-green-600" : "text-red-600"
                            }`}
                        >
                          {item.trend === "down" ? (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          )}
                          <span>{item.percent} from last month</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Content for Analytics Tab */}
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          Reports Content
        </TabsContent>
      </Tabs>

      {isGrowthOpportunityDetailDialogOpen && (
        <TopicCallListDialog
          isOpen={isGrowthOpportunityDetailDialogOpen}
          onOpenChange={setIsGrowthOpportunityDetailDialogOpen}
          topicUrdu={selectedGrowthOpportunityTopicUrdu}
          mentions={currentTopicMentions}
          onViewFullCall={handleViewFullCallFromTopicList}
        />
      )}

      {/* Hidden Audio Elements */}
      <audio ref={audioRefs["dog-barking"]} src="/audio/dog-barking.mp3" preload="auto" />
      <audio ref={audioRefs["cafe-chatter"]} src="/audio/cafe-chatter.mp3" preload="auto" />

      {/* Product Knowledge Detail Dialog */}
      {selectedKnowledgeItem && (
        <Dialog open={isKnowledgeDetailDialogOpen} onOpenChange={setIsKnowledgeDetailDialogOpen}>
          <DialogContent className="sm:max-w-lg md:max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center text-xl">
                <BookOpen className="h-6 w-6 mr-2 text-primary" />
                Knowledge Details: {selectedKnowledgeItem.product}
              </DialogTitle>
              <DialogDescription>
                Detailed insights into agent knowledge for {selectedKnowledgeItem.product}.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-6 pr-2 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground">Overall Score</h4>
                <div className="flex items-center">
                  <span
                    className={`text-3xl font-bold ${selectedKnowledgeItem.score > 80 ? "text-green-600" : selectedKnowledgeItem.score > 70 ? "text-amber-600" : "text-red-600"}`}
                  >
                    {selectedKnowledgeItem.score}%
                  </span>
                  {selectedKnowledgeItem.scoreTrend && (
                    <Badge
                      variant="outline"
                      className={`ml-3 ${selectedKnowledgeItem.scoreTrend.direction === "up" ? "border-green-500 text-green-600" : selectedKnowledgeItem.scoreTrend.direction === "down" ? "border-red-500 text-red-600" : ""}`}
                    >
                      {selectedKnowledgeItem.scoreTrend.direction === "up" ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : selectedKnowledgeItem.scoreTrend.direction === "down" ? (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      ) : null}
                      {selectedKnowledgeItem.scoreTrend.change} {selectedKnowledgeItem.scoreTrend.period}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{selectedKnowledgeItem.issues}</p>
              </div>

              {selectedKnowledgeItem.specificExamples && selectedKnowledgeItem.specificExamples.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Specific Examples / Gaps Noted</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 bg-muted/50 p-3 rounded-md">
                    {selectedKnowledgeItem.specificExamples.map((example, idx) => (
                      <li key={idx}>{example}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedKnowledgeItem.recommendedTraining && selectedKnowledgeItem.recommendedTraining.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Recommended Training</h4>
                  <div className="space-y-2">
                    {selectedKnowledgeItem.recommendedTraining.map((training, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm bg-muted/50 p-3 rounded-md">
                        <span>{training.title}</span>
                        {training.link && training.link !== "#" && (
                          <Button variant="link" size="sm" asChild>
                            <a href={training.link} target="_blank" rel="noopener noreferrer">
                              Access Module <ArrowUpRight className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        )}
                        {training.link === "#" && <Badge variant="secondary">Coming Soon</Badge>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedKnowledgeItem.actionableSteps && selectedKnowledgeItem.actionableSteps.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Actionable Next Steps for Agent</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 bg-muted/50 p-3 rounded-md">
                    {selectedKnowledgeItem.actionableSteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setIsKnowledgeDetailDialogOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Product Stat Detail Dialog */}
      {selectedProductStat && (
        <Dialog open={isProductStatDetailDialogOpen} onOpenChange={setIsProductStatDetailDialogOpen}>
          <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center text-xl">
                <selectedProductStat.IconComponent className={`h-6 w-6 mr-2 ${selectedProductStat.iconClass}`} />
                Detailed Analysis: {selectedProductStat.title}
              </DialogTitle>
              <DialogDescription>
                Insights into {selectedProductStat.title} performance and contributing factors.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-6 pr-2 max-h-[70vh] overflow-y-auto">
              {/* Overview Section */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Overview</h3>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Current Value (Top Issue Focus)</span>
                  <span className={`text-2xl font-bold ${selectedProductStat.trend.color}`}>
                    {selectedProductStat.value}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Trend</span>
                  <div className={`flex items-center ${selectedProductStat.trend.color}`}>
                    {selectedProductStat.trend.direction === "up" ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {selectedProductStat.trend.change}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Top Issue Identified:</span> {selectedProductStat.topIssue}
                </div>
              </div>

              {/* Root Causes Section */}
              {selectedProductStat.drillDownDetails.rootCauses.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                    Potential Root Causes
                  </h4>
                  <div className="space-y-3">
                    {selectedProductStat.drillDownDetails.rootCauses.map((cause, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white dark:bg-muted/20 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm">{cause.cause}</span>
                          {cause.severity && (
                            <Badge
                              variant={
                                cause.severity === "High"
                                  ? "destructive"
                                  : cause.severity === "Medium"
                                    ? "warning"
                                    : "outline"
                              }
                              className="text-xs"
                            >
                              {cause.severity} Severity
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{cause.impact}</p>
                        {cause.dataPoint && <p className="text-xs text-primary mt-1">Data: {cause.dataPoint}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Historical Performance Section */}
              {selectedProductStat.drillDownDetails.historicalPerformance.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold mb-2 flex items-center">
                    <History className="h-4 w-4 mr-2 text-blue-500" />
                    Historical Performance
                  </h4>
                  <div className="space-y-2">
                    {selectedProductStat.drillDownDetails.historicalPerformance.map((perf, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-sm p-2 bg-white dark:bg-muted/20 rounded-md border border-gray-200 dark:border-gray-700"
                      >
                        <span>
                          {perf.period}: <span className="font-semibold">{perf.value}</span>
                        </span>
                        {perf.change && (
                          <span
                            className={`text-xs ${perf.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                          >
                            {perf.change}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Metrics Section */}
              {selectedProductStat.drillDownDetails.keyMetrics.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-indigo-500" />
                    Key Related Metrics
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedProductStat.drillDownDetails.keyMetrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white dark:bg-muted/20 rounded-md border border-gray-200 dark:border-gray-700"
                      >
                        <div className="text-xs text-muted-foreground">{metric.metric}</div>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-lg font-semibold">{metric.value}</span>
                          {metric.benchmark && (
                            <span
                              className={`text-xs ${metric.status === "good" ? "text-green-500" : metric.status === "warning" ? "text-amber-500" : "text-red-500"}`}
                            >
                              vs {metric.benchmark}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Actions Section */}
              {selectedProductStat.drillDownDetails.recommendedActions.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold mb-2 flex items-center">
                    <ListChecks className="h-4 w-4 mr-2 text-green-500" />
                    Recommended Actions
                  </h4>
                  <ul className="list-disc list-inside text-sm space-y-1 bg-white dark:bg-muted/20 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                    {selectedProductStat.drillDownDetails.recommendedActions.map((action, idx) => (
                      <li key={idx}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setIsProductStatDetailDialogOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Script Adherence Detail Dialog */}
      {selectedScriptAdherenceItem && (
        <Dialog open={isScriptAdherenceDetailDialogOpen} onOpenChange={setIsScriptAdherenceDetailDialogOpen}>
          <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center text-xl">
                <ClipboardCheck className="h-6 w-6 mr-2 text-primary" />
                Script Adherence: {selectedScriptAdherenceItem.product}
              </DialogTitle>
              <DialogDescription>
                Detailed analysis of script adherence for {selectedScriptAdherenceItem.product}.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-6 pr-2 max-h-[70vh] overflow-y-auto">
              {/* Overview Section */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Adherence Overview</h3>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Current Adherence Score</span>
                  <span
                    className={`text-2xl font-bold ${selectedScriptAdherenceItem.adherenceScore > 90
                      ? "text-green-600"
                      : selectedScriptAdherenceItem.adherenceScore > 80
                        ? "text-amber-600"
                        : "text-red-600"
                      }`}
                  >
                    {selectedScriptAdherenceItem.adherenceScore}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Trend</span>
                  <div className={`flex items-center ${selectedScriptAdherenceItem.trend.color}`}>
                    {selectedScriptAdherenceItem.trend.direction === "up" ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : selectedScriptAdherenceItem.trend.direction === "down" ? (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    ) : null}
                    {selectedScriptAdherenceItem.trend.change}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Top Missed Area:</span> {selectedScriptAdherenceItem.topMissedArea}
                </div>
              </div>

              {/* Key Missed Points Section */}
              {selectedScriptAdherenceItem.drillDownDetails.keyMissedPoints.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                    Key Missed Script Points
                  </h4>
                  <div className="space-y-3">
                    {selectedScriptAdherenceItem.drillDownDetails.keyMissedPoints.map((miss, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white dark:bg-muted/20 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm">{miss.point}</span>
                          <Badge variant="outline" className="text-xs">
                            Frequency: {miss.frequency}
                          </Badge>
                        </div>
                        {miss.impact && <p className="text-xs text-muted-foreground mt-1">Impact: {miss.impact}</p>}
                        {miss.examples && miss.examples.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-semibold text-muted-foreground">Examples:</p>
                            <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 pl-2">
                              {miss.examples.map((ex, i) => (
                                <li key={i}>{ex}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Strengths Section */}
              {selectedScriptAdherenceItem.drillDownDetails.keyStrengths.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold mb-2 flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2 text-green-500" />
                    Key Strengths in Adherence
                  </h4>
                  <div className="space-y-2">
                    {selectedScriptAdherenceItem.drillDownDetails.keyStrengths.map((strength, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white dark:bg-muted/20 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm"
                      >
                        <p className="text-sm font-medium">{strength.point}</p>
                        {strength.examples && strength.examples.length > 0 && (
                          <div className="mt-1">
                            <p className="text-xs font-semibold text-muted-foreground">Examples:</p>
                            <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 pl-2">
                              {strength.examples.map((ex, i) => (
                                <li key={i}>{ex}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Impact of Non-Adherence Section */}
              {selectedScriptAdherenceItem.drillDownDetails.impactOfNonAdherence &&
                selectedScriptAdherenceItem.drillDownDetails.impactOfNonAdherence.length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-orange-500" />{" "}
                      {/* Using TrendingUp as a generic impact icon */}
                      Impact of Non-Adherence
                    </h4>
                    <div className="space-y-3">
                      {selectedScriptAdherenceItem.drillDownDetails.impactOfNonAdherence.map((impact, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white dark:bg-muted/20 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm"
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-sm">{impact.area}</span>
                            {impact.severity && (
                              <Badge
                                variant={
                                  impact.severity === "High"
                                    ? "destructive"
                                    : impact.severity === "Medium"
                                      ? "warning"
                                      : "outline"
                                }
                                className="text-xs"
                              >
                                {impact.severity} Impact
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{impact.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Common Agent Feedback Section */}
              {selectedScriptAdherenceItem.drillDownDetails.commonAgentFeedback &&
                selectedScriptAdherenceItem.drillDownDetails.commonAgentFeedback.length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold mb-2 flex items-center">
                      <Headphones className="h-4 w-4 mr-2 text-blue-500" />
                      Common Agent Feedback on Script
                    </h4>
                    <ul className="list-disc list-inside text-sm space-y-1 bg-white dark:bg-muted/20 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                      {selectedScriptAdherenceItem.drillDownDetails.commonAgentFeedback.map((feedback, idx) => (
                        <li key={idx}>{feedback}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Recommended Script Updates & Training Focus */}
              {(selectedScriptAdherenceItem.drillDownDetails.recommendedScriptUpdates ||
                selectedScriptAdherenceItem.drillDownDetails.trainingFocusAreas) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedScriptAdherenceItem.drillDownDetails.recommendedScriptUpdates &&
                      selectedScriptAdherenceItem.drillDownDetails.recommendedScriptUpdates.length > 0 && (
                        <div>
                          <h4 className="text-md font-semibold mb-2 flex items-center">
                            <ListChecks className="h-4 w-4 mr-2 text-purple-500" />
                            Recommended Script Updates
                          </h4>
                          <ul className="list-disc list-inside text-sm space-y-1 bg-white dark:bg-muted/20 p-3 rounded-md border border-gray-200 dark:border-gray-700 h-full">
                            {selectedScriptAdherenceItem.drillDownDetails.recommendedScriptUpdates.map((update, idx) => (
                              <li key={idx}>{update}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    {selectedScriptAdherenceItem.drillDownDetails.trainingFocusAreas &&
                      selectedScriptAdherenceItem.drillDownDetails.trainingFocusAreas.length > 0 && (
                        <div>
                          <h4 className="text-md font-semibold mb-2 flex items-center">
                            <BookOpen className="h-4 w-4 mr-2 text-teal-500" />
                            Training Focus Areas
                          </h4>
                          <ul className="list-disc list-inside text-sm space-y-1 bg-white dark:bg-muted/20 p-3 rounded-md border border-gray-200 dark:border-gray-700 h-full">
                            {selectedScriptAdherenceItem.drillDownDetails.trainingFocusAreas.map((focus, idx) => (
                              <li key={idx}>{focus}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                )}
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setIsScriptAdherenceDetailDialogOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <AdvancedChatBot />
    </div>
  </>)
}
