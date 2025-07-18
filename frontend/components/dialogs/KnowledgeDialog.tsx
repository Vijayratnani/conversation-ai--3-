// components/dialogs/KnowledgeDialog.tsx
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { ProductKnowledgeItem } from "@/types/dashboardTypes"

export default function KnowledgeDialog({
  isOpen,
  onClose,
  selectedItem,
}: {
  isOpen: boolean
  onClose: () => void
  selectedItem: ProductKnowledgeItem | null
}) {
  if (!selectedItem) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <h2 className="text-xl font-semibold mb-2">{selectedItem.title}</h2>
        <p>{selectedItem.description}</p>
      </DialogContent>
    </Dialog>
  )
}
