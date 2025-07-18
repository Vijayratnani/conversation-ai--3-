// components/ui/loading-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-6 w-5/6" />
      <Skeleton className="h-6 w-2/3" />
    </div>
  )
}
