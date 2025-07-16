import React from "react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface AgentKPIBoxProps {
  title: string
  count: number
  color: "green" | "amber" | "red"
  threshold: string
  trend: string
}

const bgMap = {
  green: "from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 border-green-100 dark:border-green-800/30 text-green-600 dark:text-green-400",
  amber: "from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 border-amber-100 dark:border-amber-800/30 text-amber-600 dark:text-amber-400",
  red: "from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 border-red-100 dark:border-red-800/30 text-red-600 dark:text-red-400",
}

const AgentKPIBox: React.FC<AgentKPIBoxProps> = ({ title, count, color, threshold, trend }) => {
  const isNegativeTrend = trend.startsWith("-")
  const colorClass = bgMap[color]

  return (
    <div
      className={`bg-gradient-to-br ${colorClass} border p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between`}
    >
      <div>
        <div className="text-3xl font-bold">{count}</div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground mt-1">{threshold}</div>
      </div>
      <div className={`mt-2 flex items-center text-xs ${isNegativeTrend ? "text-red-500" : "text-green-600"}`}>
        {isNegativeTrend ? <ArrowDownRight className="h-3 w-3 mr-1" /> : <ArrowUpRight className="h-3 w-3 mr-1" />}
        <span>{trend}</span>
      </div>
    </div>
  )
}

export default AgentKPIBox
