"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import ProductStatDetailsContent from "@/components/analytics/ProductStatDetailsContent"
import type { ProductStatItem } from "@/types/dashboardTypes"

interface Props {
  open: boolean
  onOpenChange: (val: boolean) => void
  selectedItem: ProductStatItem
  Icon: React.ElementType
}

export default function ProductStatModal({ open, onOpenChange, selectedItem, Icon }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Icon className={`h-6 w-6 mr-2 ${selectedItem.iconClass}`} />
            Detailed Analysis: {selectedItem.title}
          </DialogTitle>
          <DialogDescription>
            Insights into {selectedItem.title} performance and contributing factors.
          </DialogDescription>
        </DialogHeader>
        <ProductStatDetailsContent selectedProductStat={selectedItem} />
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
