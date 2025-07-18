// components/dashboard/OverviewTab/ProductStatsGrid.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, FileText } from "lucide-react";
import type { ProductStatItem } from "@/types/dashboardTypes";
import { IconMap } from "../DashboardTabs.types";

interface Props {
  productStats: ProductStatItem[];
  iconMap: IconMap;
  handleProductStatClick: (stat: ProductStatItem) => void;
}

export default function ProductStatsGrid({ productStats, iconMap, handleProductStatClick }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
      {productStats.map((stat) => {
        const Icon = iconMap[stat.iconName] ?? FileText;
        return (
          <Card
            key={stat.id}
            className="stat-card card-enhanced overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-soft-lg cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => handleProductStatClick(stat)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleProductStatClick(stat);
            }}
            role="button"
            tabIndex={0}
            aria-haspopup="dialog"
            aria-labelledby={`stat-title-${stat.id}`}
          >
            <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${stat.headerClass}`}>
              <CardTitle id={`stat-title-${stat.id}`} className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`h-8 w-8 rounded-full ${stat.iconContainerClass} flex items-center justify-center shadow-inner`}>
                <Icon className={`h-4 w-4 ${stat.iconClass}`} />
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
        );
      })}
    </div>
  );
}
