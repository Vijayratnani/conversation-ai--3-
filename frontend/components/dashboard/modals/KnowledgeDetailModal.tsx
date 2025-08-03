"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import KnowledgeAssessmentDetails from "@/components/analytics/KnowledgeAssessmentDetails"
import type { ProductKnowledgeItem } from "@/types/dashboardTypes"

interface Props {
  open: boolean
  onOpenChange: (val: boolean) => void
  selectedItem: ProductKnowledgeItem
}

export default function KnowledgeDetailModal({ open, onOpenChange, selectedItem }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <BookOpen className="h-6 w-6 mr-2 text-primary" />
            Knowledge Details: {selectedItem.product}
          </DialogTitle>
          <DialogDescription>
            Detailed insights into agent knowledge for {selectedItem.product}.
          </DialogDescription>
        </DialogHeader>
        <KnowledgeAssessmentDetails selectedKnowledgeItem={selectedItem} />
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
