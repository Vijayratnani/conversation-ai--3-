// components/ui/StatCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, FileText } from "lucide-react";

interface StatCardProps {
  id: string;
  title: string;
  value: string;
  trend: {
    direction: "up" | "down";
    change: string;
    color: string;
  };
  topIssue: string;
  iconName: string;
  iconClass: string;
  iconContainerClass: string;
  headerClass: string;
  onClick: () => void;
  iconMap?: Record<string, any>;
}

export const StatCard = ({ 
  id,
  title, 
  value, 
  trend, 
  topIssue, 
  iconName,
  iconClass,
  iconContainerClass,
  headerClass,
  onClick,
  iconMap = {}
}: StatCardProps) => {
  const Icon = iconMap[iconName] ?? FileText;
  
  return (
    <Card
      className="stat-card card-enhanced overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-soft-lg cursor-pointer hover:shadow-xl transition-shadow"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      aria-haspopup="dialog"
      aria-labelledby={`stat-title-${id}`}
    >
      <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${headerClass}`}>
        <CardTitle id={`stat-title-${id}`} className="text-sm font-medium">
          {title}
        </CardTitle>
        <div className={`h-8 w-8 rounded-full ${iconContainerClass} flex items-center justify-center shadow-inner`}>
          <Icon className={`h-4 w-4 ${iconClass}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          {trend.direction === "up" ? (
            <ArrowUpRight className={`h-4 w-4 ${trend.color} mr-1`} />
          ) : (
            <ArrowDownRight className={`h-4 w-4 ${trend.color} mr-1`} />
          )}
          <p className={`text-xs ${trend.color} font-medium`}>{trend.change}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Top issue: {topIssue}</p>
      </CardContent>
    </Card>
  );
};
