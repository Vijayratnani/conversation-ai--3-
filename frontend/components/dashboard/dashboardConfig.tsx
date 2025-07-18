// config/dashboardConfig.tsx
import { FocusedSentimentBreakdown } from "@/components/FocusedSentimentBreakdown";
import { ProductSentimentList } from "@/components/ProductSentimentList";

export const dashboardConfig = {
  sections: [
    {
      id: 'agent-stats',
      type: 'single-card',
      title: "Agent Stats",
      description: "Key performance indicators and knowledge metrics for all agents",
      className: "card-enhanced glass-effect",
      gradient: {
        from: "from-primary-50",
        to: "to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/10",
        titleFrom: "from-primary",
        titleTo: "to-primary-foreground/80"
      },
      badge: {
        text: "37 Active Agents",
        variant: "outline",
        className: "glass-effect text-primary border-primary/30"
      },
      component: 'AgentPerformancePanel'
    },
    {
      id: 'sentiment-sales',
      type: 'grid-section',
      gridCols: { md: 2, lg: 8 },
      className: "mt-6",
      cards: [
        {
          id: 'sentiment-analysis',
          title: "Sentiment Analysis by Product",
          description: "Customer sentiment breakdown and root cause analysis",
          className: "col-span-4",
          gradient: {
            from: "from-blue-50",
            to: "to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10",
            titleFrom: "from-blue-600",
            titleTo: "to-blue-400"
          },
          component: 'SentimentAnalysisCard'
        },
        {
          id: 'sales-effectiveness',
          title: "Sales & Cross-Sell Effectiveness",
          description: "Performance metrics for sales and cross-selling opportunities",
          className: "col-span-4 card-hover shadow-md",
          component: 'SalesEffectivenessPanel'
        }
      ]
    },
    {
      id: 'strategic-insights',
      type: 'grid-section',
      gridCols: { md: 2, lg: 8 },
      className: "mt-6",
      cards: [
        {
          id: 'strategic-dashboard',
          title: "Strategic Insights Dashboard",
          description: "Key metrics and signals from call center data (Last 30 days)",
          className: "col-span-8",
          gradient: {
            from: "from-indigo-50",
            to: "to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10",
            titleFrom: "from-indigo-600",
            titleTo: "to-indigo-400"
          },
          component: 'StrategicInsightsPanel'
        }
      ]
    },
    {
      id: 'agent-performance',
      type: 'single-card',
      title: "Product-Specific Agent Performance",
      description: "Detailed agent performance metrics by product category",
      className: "card-hover shadow-md",
      component: 'AgentKnowledgeInsightsGrid'
    }
  ]
};

// Sentiment analysis dialog actions configuration
export const sentimentDialogActions = [
  {
    trigger: {
      text: "Show More Products",
      variant: "ghost",
      size: "sm",
      className: "text-xs text-muted-foreground"
    },
    dialog: {
      title: "Additional Products",
      maxWidth: "sm:max-w-[600px]",
      content: <FocusedSentimentBreakdown />
    }
  },
  {
    trigger: {
      text: "View All Analysis",
      variant: "outline",
      size: "sm",
      className: "text-xs bg-transparent"
    },
    dialog: {
      title: "Complete Sentiment Analysis",
      maxWidth: "sm:max-w-[800px]",
      content: <ProductSentimentList />
    }
  }
];