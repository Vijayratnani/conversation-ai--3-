import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { productStats } from "@/constants/productStatsData"
import ProductStatCard from "./ProductStatCard"
import AgentKPIGrid from "../AgentKPI/AgentKPIGrid"
import { Badge } from "@/components/ui/badge"

export default function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Product Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {productStats.map((stat) => (
          <ProductStatCard key={stat.id} stat={stat} />
        ))}
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
            <Badge variant="outline" className="glass-effect text-primary border-primary/30">37 Active Agents</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <AgentKPIGrid />
        </CardContent>
      </Card>
    </div>
  )
}
