// components/ui/DashboardCard.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  badge?: {
    text: string;
    variant?: "default" | "outline" | "destructive";
    className?: string;
  };
  gradient?: {
    from: string;
    to: string;
    titleFrom: string;
    titleTo: string;
  };
}

export const DashboardCard = ({ 
  title, 
  description, 
  children, 
  className = "", 
  headerClassName = "",
  badge,
  gradient 
}: DashboardCardProps) => {
  const cardClasses = `overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-lg transition-all duration-300 hover:shadow-xl ${className}`;
  
  const headerClasses = gradient 
    ? `${gradient.from} ${gradient.to} border-b border-opacity-50 ${headerClassName}`
    : headerClassName;
    
  const titleClasses = gradient
    ? `bg-clip-text text-transparent bg-gradient-to-r ${gradient.titleFrom} ${gradient.titleTo}`
    : "";

  return (
    <Card className={cardClasses}>
      <CardHeader className={headerClasses}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={titleClasses}>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {badge && (
            <Badge variant={badge.variant || "outline"} className={badge.className}>
              {badge.text}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};