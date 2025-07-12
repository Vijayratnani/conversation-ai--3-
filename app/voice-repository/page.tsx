"use client" // Add 'use client' as we are using useState

import { useState } from "react" // Import useState
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Headphones, Play, Pause, Download, MoreHorizontal, Upload, Settings } from "lucide-react"
import { VoiceRepositoryConfig } from "@/components/voice-repository-config"
import { ConnectionStatus } from "@/components/connection-status"

export default function VoiceRepository() {
  const [isRepoConfigOpen, setIsRepoConfigOpen] = useState(false) // State for dialog

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Voice Repository</h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-muted-foreground">Browse and manage your voice sample library</p>
            <ConnectionStatus />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Button to trigger the dialog is now explicitly here */}
          <Button variant="outline" className="gap-2" onClick={() => setIsRepoConfigOpen(true)}>
            <Settings className="h-4 w-4" />
            Repository Config
          </Button>
          {/* VoiceRepositoryConfig is rendered here, controlled by isRepoConfigOpen */}
          <VoiceRepositoryConfig open={isRepoConfigOpen} onOpenChange={setIsRepoConfigOpen} />
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload New Sample
          </Button>
        </div>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Voice Samples</CardTitle>
              <CardDescription>Browse and manage your voice sample library</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search samples..."
                  className="pl-8 w-full sm:w-[200px] md:w-[300px]"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="all" className="rounded-md">
                All Samples
              </TabsTrigger>
              <TabsTrigger value="english" className="rounded-md">
                English
              </TabsTrigger>
              <TabsTrigger value="spanish" className="rounded-md">
                Spanish
              </TabsTrigger>
              <TabsTrigger value="french" className="rounded-md">
                French
              </TabsTrigger>
              <TabsTrigger value="other" className="rounded-md">
                Other
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Headphones className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Sample #{1001 + i}</h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date().toLocaleDateString()} • {Math.floor(Math.random() * 3) + 1}:
                          {Math.floor(Math.random() * 60)
                            .toString()
                            .padStart(2, "0")}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="mt-2 flex items-center gap-1">
                    <Badge variant="outline" className="bg-primary/5 text-xs">
                      {["English", "Spanish", "French", "German", "Italian", "Portuguese"][i % 6]}
                    </Badge>
                    <Badge variant="outline" className="bg-muted/50 text-xs">
                      {["Customer Service", "Sales Call", "Support", "Interview", "Meeting", "Presentation"][i % 6]}
                    </Badge>
                  </div>

                  <div className="mt-4 relative">
                    <div className="h-10 bg-muted/50 rounded-md flex items-center px-3">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        {i % 2 === 0 ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                      </Button>
                      <div className="flex-1 mx-2">
                        <div className="h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${i % 2 === 0 ? 0 : Math.floor(Math.random() * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">Showing 6 of 24 samples</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
