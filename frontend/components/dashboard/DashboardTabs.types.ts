// components/dashboard/DashboardTabs.types.ts
import { ProductStatItem, ProductKnowledgeItem, ScriptAdherenceItem, CallMentionDetail } from "@/types/dashboardTypes";
import type { LucideIcon } from "lucide-react";

export type IconMap = {
  [key: string]: LucideIcon;
};

export interface DashboardTabsProps {
  productStats: ProductStatItem[];
  iconMap: IconMap;
  handleProductStatClick: (stat: ProductStatItem) => void;
  selectedSentimentItem: any; // replace `any` with your proper type if you have one
  setSelectedSentimentItem: (item: any) => void;
  isSentimentDetailDialogOpen: boolean;
  setIsSentimentDetailDialogOpen: (val: boolean) => void;
  growthOpportunities: any[];
  mockMentionsData: Record<string, string[]>;
  togglePlay: (audioType: string) => void;
  playingAudio: string | null;
  setSelectedGrowthOpportunityTopic: (val: string) => void;
  setSelectedGrowthOpportunityTopicUrdu: (val: string) => void;
  setCurrentTopicMentions: (val: CallMentionDetail[]) => void;
  isGrowthOpportunityDetailDialogOpen: boolean;
  setIsGrowthOpportunityDetailDialogOpen: (val: boolean) => void;
  selectedGrowthOpportunityTopic: string;
  productKnowledgeLevels: ProductKnowledgeItem[];
  scriptAdherenceData: ScriptAdherenceItem[];
  handleKnowledgeItemClick: (item: ProductKnowledgeItem) => void;
  handleScriptAdherenceClick: (item: ScriptAdherenceItem) => void;
}
