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
import type {
  ProductKnowledgeItem,
  ProductStatItem,
  ScriptAdherenceItem,
} from "@/types/dashboardTypes"


import { generateMockMentions } from "@/lib/generateMockMentions"
import { useAudioManager } from "@/hooks/useAudioManager"
// wherever you want to use it
// import { growthOpportunities, mockMentionsData } from "@/data/growthData"
// wherever you want to use it
import { growthOpportunities, mockMentionsData } from "@/constants/growthData"
import { productKnowledgeLevels } from "@/constants/productKnowledgeData"
// import { productStats } from "@/constants/productStatsData"
import { scriptAdherenceData } from "@/constants/scriptAdherenceData"
import { AgentKPIGrid } from "@/components/AgentKPI"
import { fetchProductStats } from "@/constants/fetchProductStatsData";
import ProductStatDetailsContent from "@/components/analytics/ProductStatDetailsContent"
import ScriptAdherenceDetailsContent from '@/components/analytics/ScriptAdherenceDetailsContent'
import KnowledgeAssessmentDetails from '@/components/analytics/KnowledgeAssessmentDetails'
import AgentKnowledgeInsightsGrid from '@/components/analytics/AgentKnowledgeInsightsGrid'
import StrategicInsightsPanel from '@/components/analytics/StrategicInsightsPanel'
import SalesEffectivenessPanel from '@/components/analytics/SalesEffectivenessPanel'
import SentimentAnalysisPanel from '@/components/analytics/SentimentAnalysisPanel'
import ProductSentimentList from '@/components/analytics/ProductSentimentList'


// import {
//   FileText,
//   Package,
//   BarChart3,
//   Headphones,
// } from "lucide-react"

const iconMap: Record<string, React.ElementType> = {
  FileText,
  Package,
  BarChart3,
  Headphones,
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

  // const [playingAudio, setPlayingAudio] = useState<string | null>(null)


  const { audioRefs, togglePlay, playingAudio } = useAudioManager()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const [productStats, setProductStats] = useState<ProductStatItem[]>([])

  useEffect(() => {
    fetchProductStats().then(setProductStats).catch(console.error)
  }, [])


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

  const Icon = selectedProductStat?.iconName

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
            {productStats.map((stat) => {
              const Icon = iconMap[stat.iconName] || FileText;
              return (
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
                      <Icon className={`h-4 w-4 ${stat.iconClass}`} />
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
              );
            })}
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

                          <ProductSentimentList />
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
                  <SentimentAnalysisPanel selectedSentimentItem={selectedSentimentItem} />
                </DialogContent>
              </Dialog>
            )}

            <Card className="col-span-4 card-hover shadow-md transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Sales & Cross-Sell Effectiveness</CardTitle>
                <CardDescription>Performance metrics for sales and cross-selling opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <SalesEffectivenessPanel />
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
                <StrategicInsightsPanel
                  growthOpportunities={growthOpportunities}
                  mockMentionsData={mockMentionsData}
                  togglePlay={togglePlay}
                  playingAudio={playingAudio}
                  setSelectedGrowthOpportunityTopic={setSelectedGrowthOpportunityTopic}
                  setSelectedGrowthOpportunityTopicUrdu={setSelectedGrowthOpportunityTopicUrdu}
                  setCurrentTopicMentions={setCurrentTopicMentions}
                  setIsGrowthOpportunityDetailDialogOpen={setIsGrowthOpportunityDetailDialogOpen}
                  isGrowthOpportunityDetailDialogOpen={isGrowthOpportunityDetailDialogOpen}
                  selectedGrowthOpportunityTopic={selectedGrowthOpportunityTopic}
                />
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
              <AgentKnowledgeInsightsGrid
                productKnowledgeLevels={productKnowledgeLevels}
                scriptAdherenceData={scriptAdherenceData}
                handleKnowledgeItemClick={handleKnowledgeItemClick}
                handleScriptAdherenceClick={handleScriptAdherenceClick}
              />
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
            <KnowledgeAssessmentDetails selectedKnowledgeItem={selectedKnowledgeItem} />
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
                <Icon className={`h-6 w-6 mr-2 ${selectedProductStat.iconClass}`} />
                Detailed Analysis: {selectedProductStat.title}
              </DialogTitle>
              <DialogDescription>
                Insights into {selectedProductStat.title} performance and contributing factors.
              </DialogDescription>
            </DialogHeader>
            <ProductStatDetailsContent selectedProductStat={selectedProductStat} />
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
            <ScriptAdherenceDetailsContent selectedScriptAdherenceItem={selectedScriptAdherenceItem} />
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
