// components/ui/GridContainer.tsx
import { ReactNode } from "react";

interface GridContainerProps {
  children: ReactNode;
  className?: string;
  cols?: {
    default?: number;
    md?: number;
    lg?: number;
  };
}

export const GridContainer = ({ 
  children, 
  className = "", 
  cols = { md: 2, lg: 5 }
}: GridContainerProps) => {
  const gridClasses = `grid gap-6 ${cols.md ? `md:grid-cols-${cols.md}` : ''} ${cols.lg ? `lg:grid-cols-${cols.lg}` : ''} ${className}`;
  
  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};