"use client"

import { BarChart3, FileText, Headphones, Package, PieChart } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarHeader,
} from "@/components/ui/sidebar"

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: BarChart3,
  },
  {
    title: "Call Logs",
    href: "/call-logs",
    icon: FileText,
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
  },
  {
    title: "Voice Repository",
    href: "/voice-repository",
    icon: Headphones,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: PieChart,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return null
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-md gradient-bg text-white mx-auto mb-2">
            <Headphones className="h-5 w-5" />
          </div>
          <span className="text-xs uppercase tracking-wider font-semibold text-sidebar-foreground/70">
            Voice Analytics
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.title}
                className="transition-all duration-200"
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
