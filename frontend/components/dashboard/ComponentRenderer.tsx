// components/renderers/ComponentRenderer.tsx
import { AgentPerformancePanel } from "@/components/AgentPerformancePanel";
import { SentimentOverviewCards } from "@/components/SentimentOverviewCards";
import { SalesEffectivenessPanel } from "@/components/SalesEffectivenessPanel";
import { StrategicInsightsPanel } from "@/components/StrategicInsightsPanel";
import { AgentKnowledgeInsightsGrid } from "@/components/AgentKnowledgeInsightsGrid";
import { SentimentLegend } from "@/components/ui/SentimentLegend";
import { DialogActions } from "@/components/ui/DialogActions";
import { sentimentDialogActions } from "@/config/dashboardConfig";

interface ComponentRendererProps {
  componentName: string;
  props?: any;
}

export const ComponentRenderer = ({ componentName, props = {} }: ComponentRendererProps) => {
  const components = {
    AgentPerformancePanel: () => <AgentPerformancePanel {...props} />,
    SentimentAnalysisCard: () => (
      <div className="rounded-md flex flex-col items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="w-full h-full p-6 space-y-4">
          <SentimentLegend />
          <SentimentOverviewCards
            setSelectedSentimentItem={props.setSelectedSentimentItem}
            setIsSentimentDetailDialogOpen={props.setIsSentimentDetailDialogOpen}
          />
          <DialogActions className="mt-2" actions={sentimentDialogActions} />
        </div>
      </div>
    ),
    SalesEffectivenessPanel: () => <SalesEffectivenessPanel {...props} />,
    StrategicInsightsPanel: () => <StrategicInsightsPanel {...props} />,
    AgentKnowledgeInsightsGrid: () => <AgentKnowledgeInsightsGrid {...props} />
  };

  const Component = components[componentName as keyof typeof components];
  return Component ? <Component /> : null;
};