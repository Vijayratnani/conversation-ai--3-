// components/dashboard/OverviewTab/AgentStatsCard.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AgentPerformancePanel from "../AgentPerformancePanel";

export default function AgentStatsCard() {
  return (
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
  );
}
