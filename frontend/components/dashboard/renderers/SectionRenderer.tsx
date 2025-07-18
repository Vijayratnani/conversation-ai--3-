// components/renderers/SectionRenderer.tsx
import { DashboardCard } from "@/components/ui/DashboardCard";
import { GridContainer } from "@/components/ui/GridContainer";
import { ComponentRenderer } from "../ComponentRenderer";

interface SectionRendererProps {
  section: any;
  props?: any;
}

export const SectionRenderer = ({ section, props = {} }: SectionRendererProps) => {
  switch (section.type) {
    case 'single-card':
      return (
        <DashboardCard
          key={section.id}
          title={section.title}
          description={section.description}
          className={section.className}
          gradient={section.gradient}
          badge={section.badge}
        >
          <ComponentRenderer componentName={section.component} props={props} />
        </DashboardCard>
      );

    case 'grid-section':
      return (
        <GridContainer 
          key={section.id}
          cols={section.gridCols} 
          className={section.className}
        >
          {section.cards.map((card: any) => (
            <DashboardCard
              key={card.id}
              title={card.title}
              description={card.description}
              className={card.className}
              gradient={card.gradient}
              badge={card.badge}
            >
              <ComponentRenderer componentName={card.component} props={props} />
            </DashboardCard>
          ))}
        </GridContainer>
      );

    default:
      return null;
  }
};
