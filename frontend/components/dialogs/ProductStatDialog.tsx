// components/dialogs/ProductStatDialog.tsx
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { ProductStatItem } from "@/types/dashboardTypes"

export default function ProductStatDialog({
  isOpen,
  onClose,
  selectedItem,
  iconComponent: Icon,
}: {
  isOpen: boolean
  onClose: () => void
  selectedItem: ProductStatItem | null
  iconComponent: React.ElementType
}) {
  if (!selectedItem) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Icon className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">{selectedItem.title}</h2>
        </div>
        <p>{selectedItem.description}</p>
      </DialogContent>
    </Dialog>
  )
}
