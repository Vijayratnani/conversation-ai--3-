import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { ProductStatItem } from "@/types/dashboardTypes"

type Props = {
  stat: ProductStatItem
}

export default function ProductStatCard({ stat }: Props) {
  return (
    <Card
      className="stat-card card-enhanced overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-soft-lg cursor-pointer hover:shadow-xl transition-shadow"
      onClick={() => console.log("Drill-down for", stat.title)}
    >
      <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${stat.headerClass}`}>
        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
        <div className={`h-8 w-8 rounded-full ${stat.iconContainerClass} flex items-center justify-center shadow-inner`}>
          <stat.IconComponent className={`h-4 w-4 ${stat.iconClass}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stat.value}</div>
        <div className="flex items-center mt-1">
          {stat.trend.direction === "up" ? (
            <ArrowUpRight className={`h-4 w-4 ${stat.trend.color} mr-1`} />
          ) : (
            <ArrowDownRight className={`h-4 w-4 ${stat.trend.color} mr-1`} />
          )}
          <p className={`text-xs ${stat.trend.color} font-medium`}>{stat.trend.change}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Top issue: {stat.topIssue}</p>
      </CardContent>
    </Card>
  )
}
