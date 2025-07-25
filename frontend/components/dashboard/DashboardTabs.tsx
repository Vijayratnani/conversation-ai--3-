// const { data: productStats } = useProductStats();
// const { data: agentKPI } = useAgentKPI();

// <DashboardTabs
//   productStats={productStats || []}
//   agentKPI={agentKPI || []}
//   ...
// />










// components/dashboard/DashboardTabs.tsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowDownRight,
  ArrowUpRight,
  FileText,
  Package,
  BarChart3,
  Headphones,
} from "lucide-react";

import AgentPerformancePanel from "@/components/analytics/AgentPerformancePanel";
import SentimentOverviewCards from "@/components/analytics/SentimentOverviewCards";
import SentimentAnalysisPanel from "@/components/analytics/SentimentAnalysisPanel";
import FocusedSentimentBreakdown from "@/components/analytics/FocusedSentimentBreakdown";
import ProductSentimentList from "@/components/analytics/ProductSentimentList";
import SalesEffectivenessPanel from "@/components/analytics/SalesEffectivenessPanel";
import StrategicInsightsPanel from "@/components/analytics/StrategicInsightsPanel";
import AgentKnowledgeInsightsGrid from "@/components/analytics/AgentKnowledgeInsightsGrid";

import { DashboardTabsProps } from "./DashboardTabs.types";
import { ProductStatItem } from "@/types/dashboardTypes";

export default function DashboardTabs({
  productStats,
  iconMap,
  handleProductStatClick,
  selectedSentimentItem,
  setSelectedSentimentItem,
  isSentimentDetailDialogOpen,
  setIsSentimentDetailDialogOpen,
  growthOpportunities,
  mockMentionsData,
  togglePlay,
  playingAudio,
  setSelectedGrowthOpportunityTopic,
  setSelectedGrowthOpportunityTopicUrdu,
  setCurrentTopicMentions,
  isGrowthOpportunityDetailDialogOpen,
  setIsGrowthOpportunityDetailDialogOpen,
  selectedGrowthOpportunityTopic,
  productKnowledgeLevels,
  scriptAdherenceData,
  handleKnowledgeItemClick,
  handleScriptAdherenceClick,
}: DashboardTabsProps) {
  return (
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
          {productStats.map((stat: ProductStatItem) => {
            const Icon = (iconMap?.[stat.iconName] ?? FileText);
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
                <CardHeader
                  className={`flex flex-row items-center justify-between space-y-0 pb-2 ${stat.headerClass}`}
                >
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

                  <SentimentOverviewCards
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
  );
}
