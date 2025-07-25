export interface LocationData {
  ip: string
  city: string
  region: string
  country_name: string
  postal: string
  latitude: number
  longitude: number
  timezone: string
  org?: string
}

export async function fetchUserLocation(): Promise<LocationData> {
  const res = await fetch("http://localhost:8000/api/v1/dashboard/location")
  if (!res.ok) throw new Error("Failed to fetch user location")
  return await res.json()
}
