"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ClipboardCheck } from "lucide-react"
import ScriptAdherenceDetailsContent from "@/components/analytics/ScriptAdherenceDetailsContent"
import type { ScriptAdherenceItem } from "@/types/dashboardTypes"

interface Props {
  open: boolean
  onOpenChange: (val: boolean) => void
  selectedItem: ScriptAdherenceItem
}

export default function ScriptAdherenceModal({ open, onOpenChange, selectedItem }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <ClipboardCheck className="h-6 w-6 mr-2 text-primary" />
            Script Adherence: {selectedItem.product}
          </DialogTitle>
          <DialogDescription>
            Detailed analysis of script adherence for {selectedItem.product}.
          </DialogDescription>
        </DialogHeader>
        <ScriptAdherenceDetailsContent selectedScriptAdherenceItem={selectedItem} />
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
