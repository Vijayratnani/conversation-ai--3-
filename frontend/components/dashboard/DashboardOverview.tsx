// components/DashboardOverview.tsx
import { TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { GridContainer } from "@/components/ui/GridContainer.tsx";
import { StatCard } from "@/components/ui/StatCard.tjsx";
import { SectionRenderer } from "@/components/renderers/SectionRenderer";
import { SentimentAnalysisPanel } from "@/components/SentimentAnalysisPanel";
import { dashboardConfig } from "@/config/dashboardConfig";

export const DashboardOverview = () => {
  // ... your existing state and handlers ...
  
  // Props object for components that need them
  const componentProps = {
    // Sentiment Analysis props
    setSelectedSentimentItem,
    setIsSentimentDetailDialogOpen,
    
    // Strategic Insights props
    growthOpportunities,
    mockMentionsData,
    togglePlay,
    playingAudio,
    setSelectedGrowthOpportunityTopic,
    setSelectedGrowthOpportunityTopicUrdu,
    setCurrentTopicMentions,
    setIsGrowthOpportunityDetailDialogOpen,
    isGrowthOpportunityDetailDialogOpen,
    selectedGrowthOpportunityTopic,
    
    // Agent Knowledge props
    productKnowledgeLevels,
    scriptAdherenceData,
    handleKnowledgeItemClick,
    handleScriptAdherenceClick
  };

  return (
    <TabsContent value="overview" className="space-y-6">
      {/* Product Stats Cards */}
      <GridContainer>
        {productStats.map((stat) => (
          <StatCard
            key={stat.id}
            {...stat}
            onClick={() => handleProductStatClick(stat)}
            iconMap={iconMap}
          />
        ))}
      </GridContainer>

      {/* Render all dashboard sections using map */}
      {dashboardConfig.sections.map(section => (
        <SectionRenderer 
          key={section.id} 
          section={section} 
          props={componentProps} 
        />
      ))}

      {/* Sentiment Detail Dialog */}
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
    </TabsContent>
  );
};