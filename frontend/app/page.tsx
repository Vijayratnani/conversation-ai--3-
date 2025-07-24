 "use client"
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
import { useAudioManager } from "@/hooks/useAudioManager"
import { growthOpportunities, mockMentionsData } from "@/constants/growthData"
import { productKnowledgeLevels } from "@/constants/productKnowledgeData"
import { scriptAdherenceData } from "@/constants/scriptAdherenceData"
import { fetchProductStats } from "@/constants/fetchProductStatsData";
import ProductStatDetailsContent from "@/components/analytics/ProductStatDetailsContent"
import ScriptAdherenceDetailsContent from '@/components/analytics/ScriptAdherenceDetailsContent'
import KnowledgeAssessmentDetails from '@/components/analytics/KnowledgeAssessmentDetails'
import DashboardTabs from "@/components/dashboard/DashboardTabs"

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
  const Icon = iconMap[selectedProductStat?.iconName || "FileText"];
  return (<>
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 subtle-pattern">
      <div className="flex items-center justify-end">
        <Badge variant="outline" className="glass-effect text-primary border-primary/30">
          Last updated: Today, 10:30 AM
        </Badge>
      </div>
      <DashboardTabs
        productStats={productStats}
        iconMap={iconMap}
        handleProductStatClick={handleProductStatClick}
        selectedSentimentItem={selectedSentimentItem}
        setSelectedSentimentItem={setSelectedSentimentItem}
        isSentimentDetailDialogOpen={isSentimentDetailDialogOpen}
        setIsSentimentDetailDialogOpen={setIsSentimentDetailDialogOpen}
        growthOpportunities={growthOpportunities}
        mockMentionsData={mockMentionsData}
        togglePlay={togglePlay}
        playingAudio={playingAudio}
        setSelectedGrowthOpportunityTopic={setSelectedGrowthOpportunityTopic}
        setSelectedGrowthOpportunityTopicUrdu={setSelectedGrowthOpportunityTopicUrdu}
        setCurrentTopicMentions={setCurrentTopicMentions}
        isGrowthOpportunityDetailDialogOpen={isGrowthOpportunityDetailDialogOpen}
        setIsGrowthOpportunityDetailDialogOpen={setIsGrowthOpportunityDetailDialogOpen}
        selectedGrowthOpportunityTopic={selectedGrowthOpportunityTopic}
        productKnowledgeLevels={productKnowledgeLevels}
        scriptAdherenceData={scriptAdherenceData}
        handleKnowledgeItemClick={handleKnowledgeItemClick}
        handleScriptAdherenceClick={handleScriptAdherenceClick}
      />
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
      {/*{selectedProductStat && (
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
      )} */}

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
