// components/dialogs/ScriptAdherenceDialog.tsx
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { ScriptAdherenceItem } from "@/types/dashboardTypes"

export default function ScriptAdherenceDialog({
  isOpen,
  onClose,
  selectedItem,
}: {
  isOpen: boolean
  onClose: () => void
  selectedItem: ScriptAdherenceItem | null
}) {
  if (!selectedItem) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <h2 className="text-xl font-semibold mb-2">{selectedItem.title}</h2>
        <p>{selectedItem.details}</p>
      </DialogContent>
    </Dialog>
  )
}
