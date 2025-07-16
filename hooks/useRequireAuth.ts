// hooks/useRequireAuth.ts
import { useEffect } from "react"
import { useRouter } from "next/navigation"
// import { useAuth } from "@/hooks/useAuth" // adjust based on your actual auth hook
import { useAuth } from "@/components/auth-provider"

export const useRequireAuth = () => {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  return { isAuthenticated }
}
