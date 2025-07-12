"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ConnectionStatusProps {
  className?: string
}

export function ConnectionStatus({ className }: ConnectionStatusProps) {
  const [status, setStatus] = useState<"connected" | "disconnected" | "error">("connected")
  const [currentConnection, setCurrentConnection] = useState("Local Storage")

  useEffect(() => {
    // Simulate connection status checking
    const interval = setInterval(() => {
      // In a real implementation, this would check the actual connection status
      const statuses: Array<"connected" | "disconnected" | "error"> = ["connected", "connected", "connected", "error"]
      setStatus(statuses[Math.floor(Math.random() * statuses.length)])
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return <Wifi className="h-3 w-3" />
      case "disconnected":
        return <WifiOff className="h-3 w-3" />
      case "error":
        return <AlertTriangle className="h-3 w-3" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30"
      case "disconnected":
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800/30"
      case "error":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30"
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "Connected"
      case "disconnected":
        return "Disconnected"
      case "error":
        return "Connection Error"
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`${getStatusColor()} ${className} cursor-help`}>
            {getStatusIcon()}
            <span className="ml-1 text-xs">{getStatusText()}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-medium">Repository Connection</p>
            <p className="text-muted-foreground">Active: {currentConnection}</p>
            <p className="text-muted-foreground">Status: {getStatusText()}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
