// /frontend/lib/fetcher.ts
export default async function fetcher<T = any>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`An error occurred while fetching: ${res.statusText}`)
  }
  return res.json()
}
