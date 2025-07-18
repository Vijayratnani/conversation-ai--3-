// components/dashboard/OverviewTab/OverviewTabContent.tsx
import { TabsContent } from "@/components/ui/tabs";
import ProductStatsGrid from "./ProductStatsGrid";
import AgentStatsCard from "./AgentStatsCard";
import SentimentAnalysisSection from "./SentimentAnalysisSection";
import SalesEffectivenessCard from "./SalesEffectivenessCard";
import StrategicInsightsSection from "./StrategicInsightsSection";
import AgentKnowledgeInsightsCard from "./AgentKnowledgeInsightsCard";

export default function OverviewTabContent(props) {
  return (
    <TabsContent value="overview" className="space-y-6">
      <ProductStatsGrid {...props} />
      <AgentStatsCard />
      <SentimentAnalysisSection {...props} />
      <SalesEffectivenessCard />
      <StrategicInsightsSection {...props} />
      <AgentKnowledgeInsightsCard {...props} />
    </TabsContent>
  );
}
