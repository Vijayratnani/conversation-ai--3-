// components/analytics/TopPerformingAgents.tsx

import { ArrowUpRight } from "lucide-react"

interface Agent {
  name: string
  score: number
  product: string
  improvement: string
}

const agents: Agent[] = [
  { name: "Sarah K.", score: 94, product: "Credit Cards", improvement: "+3%" },
  { name: "Michael R.", score: 92, product: "Personal Loans", improvement: "+5%" },
  { name: "Jessica T.", score: 91, product: "Savings Accounts", improvement: "+2%" },
]

export default function TopPerformingAgents() {
  return (
    <div className="bg-white dark:bg-muted/20 p-4 rounded-lg shadow-sm border border-muted/50">
      <h3 className="text-sm font-medium mb-3">Top Performing Agents</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div key={agent.name} className="flex items-center gap-3 p-2 rounded-md bg-muted/30">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
              {agent.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <div className="font-medium text-sm">{agent.name}</div>
              <div className="text-xs text-muted-foreground">{agent.product} Specialist</div>
              <div className="flex items-center text-xs text-green-600 mt-0.5">
                <span className="font-medium mr-1">{agent.score}%</span>
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                <span>{agent.improvement}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
