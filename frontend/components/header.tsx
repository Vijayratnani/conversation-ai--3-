"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { MicIcon, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      <SidebarTrigger className="text-primary" />
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-md gradient-bg text-white">
          <MicIcon className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-primary">Conversation AI</h1>
          <p className="text-xs text-muted-foreground">Multilingual Voice Call Analysis</p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <span className="text-sm">Welcome, {user?.name || "User"}</span>
            <Button variant="outline" size="sm" onClick={logout} className="flex items-center gap-1">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </header>
  )
}
