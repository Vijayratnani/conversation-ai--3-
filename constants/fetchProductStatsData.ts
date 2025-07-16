import { ProductStatItem } from "@/types/dashboardTypes"

export async function fetchProductStats(): Promise<ProductStatItem[]> {
  const res = await fetch("http://localhost:8000/api/v1/product-stats") // Adjust to your API URL
  if (!res.ok) throw new Error("Failed to fetch product stats")
  return await res.json()
}
