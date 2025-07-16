import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AgentKPIBox from "./AgentKPIBox"

const AgentKPIGrid = () => {
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
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-1 md:col-span-3">
              <div className="grid grid-cols-3 gap-4 h-full">
                <AgentKPIBox
                  title="Excellent Knowledge"
                  count={12}
                  color="green"
                  threshold="90% or higher"
                  trend="+2 from last month"
                />
                <AgentKPIBox
                  title="Good Knowledge"
                  count={18}
                  color="amber"
                  threshold="75–89%"
                  trend="+3 from last month"
                />
                <AgentKPIBox
                  title="Needs Improvement"
                  count={7}
                  color="red"
                  threshold="Below 75%"
                  trend="-1 from last month"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AgentKPIGrid
