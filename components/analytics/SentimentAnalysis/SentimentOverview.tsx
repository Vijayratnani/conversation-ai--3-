"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight } from "lucide-react"
import { SentimentItem } from "./types"
import { SentimentDetailDialog } from "./SentimentDialog"
import { ShowMoreProductsDialog } from "./ShowMoreProductsDialog"
import { FullSentimentDialog } from "./FullSentimentDialog"

const initialSentimentData: SentimentItem[] = [
  {
    product: "Credit Cards",
    positive: 25,
    neutral: 30,
    negative: 45,
    warning: true,
    causes: ["Hidden fees", "Interest rates", "Customer service"],
  },
  {
    product: "Personal Loans",
    positive: 40,
    neutral: 35,
    negative: 25,
    warning: false,
    causes: ["Application process", "Approval time"],
  },
  {
    product: "Savings Accounts",
    positive: 55,
    neutral: 30,
    negative: 15,
    warning: false,
    causes: ["Interest rates"],
  },
]

export function SentimentOverview() {
  const [selectedItem, setSelectedItem] = useState<SentimentItem | null>(null)
  const [isDialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="rounded-md flex flex-col items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div className="w-full h-full p-6 space-y-4">
        {/* Sentiment Legend */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 bg-white/80 py-2 px-4 rounded-lg shadow-sm backdrop-blur-sm">
            <Legend color="bg-green-500" label="Positive" />
            <Legend color="bg-gray-300" label="Neutral" />
            <Legend color="bg-red-500" label="Negative" />
          </div>
          <div className="text-xs text-muted-foreground bg-muted/30 py-1 px-2 rounded-md">Last 30 days</div>
        </div>

        {/* Sentiment Bars */}
        <div className="grid gap-2">
          {initialSentimentData.map((item) => (
            <div
              key={item.product}
              className="bg-white dark:bg-muted/20 p-3 rounded-lg border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.product}</span>
                  {item.warning && (
                    <Badge variant="destructive" className="text-xs py-0.5">
                      ⚠️
                    </Badge>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs glass-effect bg-transparent"
                  onClick={() => {
                    setSelectedItem(item)
                    setDialogOpen(true)
                  }}
                >
                  Details
                </Button>
              </div>

              <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex mt-2">
                <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${item.positive}%` }} />
                <div className="h-full bg-gray-300 transition-all duration-500" style={{ width: `${item.neutral}%` }} />
                <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${item.negative}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Dialogs */}
        {selectedItem && (
          <SentimentDetailDialog
            open={isDialogOpen}
            onOpenChange={setDialogOpen}
            item={selectedItem}
          />
        )}
        <div className="flex justify-between items-center mt-2">
          <ShowMoreProductsDialog />
          <FullSentimentDialog />
        </div>
      </div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 ${color} rounded-full shadow-sm`} />
      <span className="font-medium text-xs">{label}</span>
    </div>
  )
}
