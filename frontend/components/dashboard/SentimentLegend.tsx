// components/ui/SentimentLegend.tsx
interface SentimentLegendProps {
  timeRange?: string;
}

export const SentimentLegend = ({ timeRange = "Last 30 days" }: SentimentLegendProps) => {
  const legendItems = [
    { color: "bg-green-500", label: "Positive" },
    { color: "bg-gray-300", label: "Neutral" },
    { color: "bg-red-500", label: "Negative" }
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6 bg-white/80 py-2 px-4 rounded-lg shadow-sm backdrop-blur-sm">
        {legendItems.map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 ${item.color} rounded-full shadow-sm`}></div>
            <span className="font-medium text-xs">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="text-xs text-muted-foreground bg-muted/30 py-1 px-2 rounded-md">
        {timeRange}
      </div>
    </div>
  );
};