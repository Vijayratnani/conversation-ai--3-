"use client"

import { DashboardTabsProps } from "@/components/dashboard/DashboardTabs.types";

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import {
  FileText,
  Headphones,
  Package,
  BarChart3,
  BookOpen,
  ClipboardCheck,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"


import { AdvancedChatBot } from "@/components/advanced-chat-bot"
import { TopicCallListDialog } from "@/components/topic-call-list-dialog"
// import type { CallMentionDetail } from "@/types"

// Define a more specific type for product knowledge items

import AgentPerformancePanel from "@/components/analytics/AgentPerformancePanel"
import SentimentOverviewCards from "@/components/analytics/SentimentOverviewCards"
import SentimentAnalysisPanel from "@/components/analytics/SentimentAnalysisPanel"
import FocusedSentimentBreakdown from "@/components/analytics/FocusedSentimentBreakdown"
import ProductSentimentList from "@/components/analytics/ProductSentimentList"
import SalesEffectivenessPanel from "@/components/analytics/SalesEffectivenessPanel"
import StrategicInsightsPanel from "@/components/analytics/StrategicInsightsPanel"
import AgentKnowledgeInsightsGrid from "@/components/analytics/AgentKnowledgeInsightsGrid"
import ProductStatDetailsContent from "@/components/analytics/ProductStatDetailsContent"
import ScriptAdherenceDetailsContent from "@/components/analytics/ScriptAdherenceDetailsContent"
import KnowledgeAssessmentDetails from "@/components/analytics/KnowledgeAssessmentDetails"

import { useAudioManager } from "@/hooks/useAudioManager"
import { useSentimentData } from "@/hooks/useSentimentData"
import { useSalesEffectiveness } from "@/hooks/useSalesEffectiveness"
import { useStrategicInsights } from "@/hooks/useStrategicInsights"

import {
  // growthOpportunities,
  // mockMentionsData,
  // productKnowledgeLevels,
  // scriptAdherenceData,
  fetchProductStats
} from "@/constants/fetchProductStatsData"
import { growthOpportunities } from "@/constants/growthData"
import { productKnowledgeLevels } from "@/constants/productKnowledgeData"
import { scriptAdherenceData } from "@/constants/scriptAdherenceData"

import type {
  ProductStatItem,
  ProductKnowledgeItem,
  ScriptAdherenceItem,
} from "@/types/dashboardTypes"
import { mockMentionsData } from "@/constants/growthData"
import type { CallMentionDetail } from "@/types"

const iconMap: Record<string, React.ElementType> = {
  FileText,
  Package,
  BarChart3,
  Headphones,
}

export default function Dashboard() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) router.push("/login")
  }, [isAuthenticated])

  if (!isAuthenticated) return null

  const [productStats, setProductStats] = useState<ProductStatItem[]>([])
  useEffect(() => {
    fetchProductStats().then(setProductStats).catch(console.error)
  }, [])

  const { sentimentData } = useSentimentData()
  const { salesData } = useSalesEffectiveness()
  const { strategicData } = useStrategicInsights()
  const { audioRefs, togglePlay, playingAudio } = useAudioManager()

  // Dialog States
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

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  // const [productStats, setProductStats] = useState<ProductStatItem[]>([])
  useEffect(() => {
    fetchProductStats().then(setProductStats).catch(console.error)
  }, [])

  // const { sentimentData } = useSentimentData();
  // const { salesData } = useSalesEffectiveness();

  // const handleKnowledgeItemClick = (item: ProductKnowledgeItem) => {
  //   setSelectedKnowledgeItem(item)
  //   setIsKnowledgeDetailDialogOpen(true)
  // }

  const handleProductStatClick = (item: ProductStatItem) => {
    setSelectedProductStat(item)
    setIsProductStatDetailDialogOpen(true)
  }

  const handleKnowledgeItemClick = (item: ProductKnowledgeItem) => {
    setSelectedKnowledgeItem(item)
    setIsKnowledgeDetailDialogOpen(true)
  }

  // const handleProductStatClick = (item: ProductStatItem) => {
  //   setSelectedProductStat(item)
  //   setIsProductStatDetailDialogOpen(true)
  // }

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
  const Icon = iconMap[selectedProductStat?.iconName || "FileText"];
  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 subtle-pattern">
      <div className="flex items-center justify-end">
        <Badge variant="outline" className="glass-effect text-primary border-primary/30">
          Last updated: Today, 10:30 AM
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        {/* Tabs List */}
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
            {productStats.map((stat: ProductStatItem) => {
              const Icon = iconMap?.[stat.iconName] ?? FileText;
              return (
                <Card
                  key={stat.id}
                  className="stat-card card-enhanced overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-soft-lg cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => handleProductStatClick(stat)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleProductStatClick(stat);
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

          {/* Agent KPIs */}
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
              <AgentPerformancePanel />
            </CardContent>
          </Card>

          {/* Sentiment & Sales Effectiveness */}
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
                    {/* Sentiment Tags */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 bg-white/80 py-2 px-4 rounded-lg shadow-sm backdrop-blur-sm">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div><span className="font-medium text-xs">Positive</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-300 rounded-full shadow-sm"></div><span className="font-medium text-xs">Neutral</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div><span className="font-medium text-xs">Negative</span></div>
                      </div>
                      <div className="text-xs text-muted-foreground bg-muted/30 py-1 px-2 rounded-md">Last 30 days</div>
                    </div>

                    <SentimentOverviewCards
                      sentimentData={sentimentData}
                      setSelectedSentimentItem={setSelectedSentimentItem}
                      setIsSentimentDetailDialogOpen={setIsSentimentDetailDialogOpen}
                    />

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
                          <FocusedSentimentBreakdown />
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-xs bg-transparent">
                            View All Analysis
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px]">
                          <DialogHeader><DialogTitle>Complete Sentiment Analysis</DialogTitle></DialogHeader>
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
                <SalesEffectivenessPanel salesData={salesData} />
              </CardContent>
            </Card>
          </div>

          {/* Strategic Insights Panel */}
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
                  growthOpportunities={strategicData.growthOpportunities}
                  riskIndicators={strategicData.riskIndicators}
                  agentPerformance={strategicData.agentPerformance}
                  avgHoldTimeStats={strategicData.avgHoldTimeStats}
                  callEnvironmentStats={strategicData.callEnvironmentStats}
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

      {isGrowthOpportunityDetailDialogOpen && (
        <TopicCallListDialog
          isOpen={isGrowthOpportunityDetailDialogOpen}
          onOpenChange={setIsGrowthOpportunityDetailDialogOpen}
          topicUrdu={selectedGrowthOpportunityTopicUrdu}
          mentions={currentTopicMentions}
          onViewFullCall={(callId) => alert(`Call: ${callId}`)}
        />
      )}

      <audio ref={audioRefs["dog-barking"] as RefObject<HTMLAudioElement>} />

      <audio ref={audioRefs["dog-barking"]} src="/audio/dog-barking.mp3" preload="auto" />
      <audio ref={audioRefs["cafe-chatter"]} src="/audio/cafe-chatter.mp3" preload="auto" />

      <AdvancedChatBot />
    </div>
  )
}
