import { ProductStatItem } from "@/types/dashboardTypes"

const productStyles: Record<
  string,
  {
    iconContainerClass: string
    iconClass: string
    headerClass: string
    iconName: string
  }
> = {
  "credit card": {
    iconContainerClass: "bg-red-100",
    iconClass: "text-red-500",
    headerClass:
      "bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10",
    iconName: "FileText",
  },
  "personal loan": {
    iconContainerClass: "bg-amber-100",
    iconClass: "text-amber-500",
    headerClass:
      "bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10",
    iconName: "Package",
  },
  "Car Loan": {
    iconContainerClass: "bg-purple-100",
    iconClass: "text-purple-500",
    headerClass:
      "bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10",
    iconName: "Package",
  },
  "health insurance": {
    iconContainerClass: "bg-pink-100",
    iconClass: "text-pink-500",
    headerClass:
      "bg-gradient-to-r from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-800/10",
    iconName: "HeartPulse",
  },
  "travel insurance": {
    iconContainerClass: "bg-sky-100",
    iconClass: "text-sky-500",
    headerClass:
      "bg-gradient-to-r from-sky-50 to-sky-100/50 dark:from-sky-900/20 dark:to-sky-800/10",
    iconName: "Plane",
  },
  // fallback style
  default: {
    iconContainerClass: "bg-gray-100",
    iconClass: "text-gray-500",
    headerClass:
      "bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-900/20 dark:to-gray-800/10",
    iconName: "BarChart3",
  },
}

export async function fetchProductStats(): Promise<ProductStatItem[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/dashboard/product-stats`)
  if (!res.ok) throw new Error("Failed to fetch product stats")

  const data = await res.json()

  return data.map((item: any): ProductStatItem => {
    const direction = item.trend > 0 ? "up" : item.trend < 0 ? "down" : "flat"
    const color =
      direction === "up"
        ? "text-red-500"
        : direction === "down"
        ? "text-green-500"
        : "text-muted-foreground"
    const changeText = `${item.trend > 0 ? "+" : ""}${item.trend}% from last month`

    const key = item.product_name.trim().toLowerCase()
    const style = productStyles[key] ?? productStyles["default"]

    return {
      id: key.replace(/\s+/g, "-"),
      title: item.product_name,
      value: `${item.value}%`,
      trend: {
        direction,
        change: changeText,
        color,
      },
      topIssue: item.top_issue,
      iconName: style.iconName,
      iconContainerClass: style.iconContainerClass,
      iconClass: style.iconClass,
      headerClass: style.headerClass,
    }
  })
}
