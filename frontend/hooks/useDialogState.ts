import { useState } from "react"

export function useDialogState<T = any>() {
  const [selectedItem, setSelectedItem] = useState<T | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const open = (item: T) => {
    setSelectedItem(item)
    setIsOpen(true)
  }

  const close = () => setIsOpen(false)

  return { selectedItem, isOpen, open, close }
}
