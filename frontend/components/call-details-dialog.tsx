"use client"

import { useState, useMemo } from "react"
import { ArrowLeft, Copy, Download, Play, User, Clock, AlertTriangle, BarChart, SearchIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import type { Call, TranscriptEntry } from "@/types" // <-- IMPORTING CENTRALIZED TYPES

interface CallDetailsDialogProps {
  call: Call
}

export default function CallDetailsDialog({ call }: CallDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState("transcript") // Default to transcript tab
  const [transcriptSearchTerm, setTranscriptSearchTerm] = useState("")
  const [showSensitive, setShowSensitive] = useState(false)

  const transcriptToDisplay: TranscriptEntry[] = call.transcriptEntries || []

  const filteredTranscript = useMemo(() => {
    if (!transcriptSearchTerm.trim()) {
      return transcriptToDisplay
    }
    const lowerCaseSearchTerm = transcriptSearchTerm.toLowerCase()
    return transcriptToDisplay.filter((entry) => {
      const originalMatch = entry.originalText.toLowerCase().includes(lowerCaseSearchTerm)
      const translatedMatch = entry.translatedText
        ? entry.translatedText.toLowerCase().includes(lowerCaseSearchTerm)
        : false
      return originalMatch || translatedMatch
    })
  }, [transcriptSearchTerm, transcriptToDisplay])

  const renderTranscriptEntry = (entry: TranscriptEntry) => {
    const displayText =
      showSensitive || !entry.isSensitive
        ? entry.originalText
        : entry.sensitivePlaceholder || "[Sensitive Information Masked]"
    const displayTranslatedText =
      showSensitive || !entry.isSensitive
        ? entry.translatedText
        : entry.sensitivePlaceholder && entry.translatedText
          ? `Translated: ${entry.sensitivePlaceholder}`
          : undefined

    const primaryTag = entry.tags?.find(
      (tag) => tag.type === "sentiment" || tag.type === "info" || (tag.type === "topic" && !tag.icon),
    )
    const secondaryTags = entry.tags?.filter(
      (tag) => !(tag.type === "sentiment" || tag.type === "info" || (tag.type === "topic" && !tag.icon)),
    )

    const speakerDisplayName = entry.speakerName || (entry.speaker === "Agent" ? call.agent : "Customer")

    return (
      <div key={entry.id} className="flex gap-4">
        <div
          className={`w-8 h-8 rounded-full ${entry.speaker === "Agent" ? "bg-primary/10" : "bg-muted/50"} flex items-center justify-center shrink-0`}
        >
          <User className={`h-4 w-4 ${entry.speaker === "Agent" ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-medium">{speakerDisplayName}</span>
            <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
            {primaryTag && (
              <Badge variant={primaryTag.variant || "outline"} className={`text-xs ${primaryTag.className || ""}`}>
                {primaryTag.icon && <primaryTag.icon className="h-3 w-3 mr-1" />}
                {primaryTag.text}
              </Badge>
            )}
          </div>
          <div className="bg-muted/10 p-3 rounded-md">
            <p className="text-sm font-medium">{displayText}</p>
            {displayTranslatedText && (
              <p className="text-xs text-muted-foreground mt-1 italic">{displayTranslatedText}</p>
            )}
          </div>
          {secondaryTags && secondaryTags.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {secondaryTags.map((tag, index) => (
                <Badge key={index} variant={tag.variant || "outline"} className={`text-xs ${tag.className || ""}`}>
                  {tag.icon && <tag.icon className="h-3 w-3 mr-1" />}
                  {tag.text}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  const durationInSeconds = useMemo(() => {
    if (!call.duration) return 1
    const parts = call.duration.split(":")
    if (parts.length === 2) return Number.parseInt(parts[0], 10) * 60 + Number.parseInt(parts[1], 10)
    if (parts.length === 3)
      return Number.parseInt(parts[0], 10) * 3600 + Number.parseInt(parts[1], 10) * 60 + Number.parseInt(parts[2], 10)
    return 1
  }, [call.duration])

  return (
    <DialogContent className="max-w-5xl p-0 overflow-hidden">
      <div className="flex flex-col h-[80vh]">
        <DialogHeader className="p-4 border-b flex items-center justify-between flex-row">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                /* This should be handled by onOpenChange in the parent */
              }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-xl font-bold">{call.id || "N/A"}</DialogTitle>
                <Badge
                  variant={
                    call.outcome === "Resolved" ? "default" : call.outcome === "Escalated" ? "destructive" : "secondary"
                  }
                >
                  {call.outcome || "N/A"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {call.date || "N/A"} {call.time || "N/A"} • {call.duration || "N/A"} •
                <Badge
                  variant="outline"
                  className={`ml-1 ${
                    call.direction === "Inbound"
                      ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30"
                      : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30"
                  }`}
                >
                  {call.direction || "N/A"}
                </Badge>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Copy className="h-4 w-4" /> <span>Copy ID</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" /> <span>Export</span>
            </Button>
            <Button size="sm" className="gap-1">
              <Play className="h-4 w-4" /> <span>Listen</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-56 border-r bg-muted/20">
            <nav className="flex flex-col p-2">
              <Button
                variant={activeTab === "overview" ? "secondary" : "ghost"}
                className="justify-start gap-2 mb-1"
                onClick={() => setActiveTab("overview")}
              >
                <BarChart className="h-4 w-4" /> <span>Overview</span>
              </Button>
              <Button
                variant={activeTab === "details" ? "secondary" : "ghost"}
                className="justify-start gap-2 mb-1"
                onClick={() => setActiveTab("details")}
              >
                <AlertTriangle className="h-4 w-4" /> <span>Details</span>
              </Button>
              <Button
                variant={activeTab === "transcript" ? "secondary" : "ghost"}
                className="justify-start gap-2 mb-1"
                onClick={() => setActiveTab("transcript")}
              >
                <Copy className="h-4 w-4" /> <span>Transcript</span>
              </Button>
              <Button
                variant={activeTab === "metrics" ? "secondary" : "ghost"}
                className="justify-start gap-2"
                onClick={() => setActiveTab("metrics")}
              >
                <BarChart className="h-4 w-4" /> <span>Metrics</span>
              </Button>
            </nav>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-background dark:bg-muted/20 p-4 rounded-lg border shadow-sm">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-muted-foreground">Agent Talk Time</h3>
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">{call.agentTalkTime || 0}%</div>
                    </div>
                  </div>
                  <div className="bg-background dark:bg-muted/20 p-4 rounded-lg border shadow-sm">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-muted-foreground">Silence Duration</h3>
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">{call.silenceDuration || 0} sec</div>
                    </div>
                  </div>
                  <div className="bg-background dark:bg-muted/20 p-4 rounded-lg border shadow-sm">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-muted-foreground">Interruptions</h3>
                      <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">{call.interruptions || 0}</div>
                    </div>
                  </div>
                  <div className="bg-background dark:bg-muted/20 p-4 rounded-lg border shadow-sm">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-muted-foreground">Key Topics</h3>
                      <BarChart className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">{Object.keys(call.keyTopics || {}).length}</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-background dark:bg-muted/20 p-6 rounded-lg border shadow-sm">
                    <h3 className="text-base font-medium mb-4">Compliance Score</h3>
                    <div className="flex justify-center">
                      <div className="relative w-32 h-32">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold">{call.complianceScore || 0}%</div>
                            <div className="text-xs text-muted-foreground">Compliance</div>
                          </div>
                        </div>
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            className="text-muted stroke-current"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="42"
                            cx="50"
                            cy="50"
                          />
                          <circle
                            className="text-primary stroke-current"
                            strokeWidth="8"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="42"
                            cx="50"
                            cy="50"
                            strokeDasharray={`${(call.complianceScore || 0) * 2.64}, 264`}
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="bg-background dark:bg-muted/20 p-6 rounded-lg border shadow-sm">
                    <h3 className="text-base font-medium mb-4">Sentiment Analysis</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Customer</span>
                        <div
                          className={`flex items-center ${call.customerSentiment === "Positive" ? "text-green-600" : call.customerSentiment === "Negative" ? "text-red-600" : "text-gray-600"}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-1 ${call.customerSentiment === "Positive" ? "bg-green-500" : call.customerSentiment === "Negative" ? "bg-red-500" : "bg-gray-500"}`}
                          ></div>
                          {call.customerSentiment || "N/A"}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Agent</span>
                        <div
                          className={`flex items-center ${call.agentSentiment === "Empathetic" ? "text-green-600" : call.agentSentiment === "Frustrated" ? "text-red-600" : "text-blue-600"}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-1 ${call.agentSentiment === "Empathetic" ? "bg-green-500" : call.agentSentiment === "Frustrated" ? "bg-red-500" : "bg-blue-500"}`}
                          ></div>
                          {call.agentSentiment || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-background dark:bg-muted/20 p-6 rounded-lg border shadow-sm">
                  <h3 className="text-base font-medium mb-4">Key Topics</h3>
                  <div className="space-y-3">
                    {Object.entries(call.keyTopics || {}).map(([topic, count]) => (
                      <div key={topic} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-primary mr-2"></div> <span>{topic}</span>
                        </div>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-background dark:bg-muted/20 p-6 rounded-lg border shadow-sm">
                  <h3 className="text-base font-medium mb-2">Call Summary</h3>
                  <p className="text-sm">{call.notes || "No summary available."}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium">Next Action</h4>
                      <p className="text-sm text-muted-foreground">{call.nextAction || "None"}</p>
                    </div>
                    <Button>Take Action</Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "details" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Call Information</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Call ID</div>
                        <div className="text-sm font-medium">{call.id || "N/A"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Date & Time</div>
                        <div className="text-sm font-medium">
                          {call.date || "N/A"} {call.time || "N/A"}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Duration</div>
                        <div className="text-sm font-medium">{call.duration || "N/A"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Direction</div>
                        <div className="text-sm font-medium">
                          <Badge
                            variant="outline"
                            className={`${call.direction === "Inbound" ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30" : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30"}`}
                          >
                            {call.direction || "N/A"}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Client ID</div>
                        <div className="text-sm font-medium">{call.clientId || "N/A"}</div>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium mt-6 mb-4">Participants</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Caller</div>
                        <div className="text-sm font-medium">{call.caller || "N/A"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Callee / Agent</div>
                        <div className="text-sm font-medium">{call.agent || "N/A"}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Call Metrics</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Agent Talk Time</div>
                        <div className="text-sm font-medium">{call.agentTalkTime || 0}%</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Silence Duration</div>
                        <div className="text-sm font-medium">{call.silenceDuration || 0} sec</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Interruptions</div>
                        <div className="text-sm font-medium">{call.interruptions || 0}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Compliance Score</div>
                        <div className="text-sm font-medium text-green-600">{call.complianceScore || 0}%</div>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium mt-6 mb-4">Sentiment Analysis</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Customer Sentiment</div>
                        <div
                          className={`text-sm font-medium flex items-center ${call.customerSentiment === "Positive" ? "text-green-600" : call.customerSentiment === "Negative" ? "text-red-600" : "text-gray-600"}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-1 ${call.customerSentiment === "Positive" ? "bg-green-500" : call.customerSentiment === "Negative" ? "bg-red-500" : "bg-gray-500"}`}
                          ></div>
                          {call.customerSentiment || "N/A"}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Agent Sentiment</div>
                        <div
                          className={`text-sm font-medium flex items-center ${call.agentSentiment === "Empathetic" ? "text-green-600" : call.agentSentiment === "Frustrated" ? "text-red-600" : "text-blue-600"}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-1 ${call.agentSentiment === "Empathetic" ? "bg-green-500" : call.agentSentiment === "Frustrated" ? "bg-red-500" : "bg-blue-500"}`}
                          ></div>
                          {call.agentSentiment || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Call Outcome</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Outcome</div>
                        <div className="text-sm font-medium">
                          <Badge
                            variant={
                              call.outcome === "Resolved"
                                ? "default"
                                : call.outcome === "Escalated"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {call.outcome || "N/A"}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Next Action</div>
                        <div className="text-sm font-medium">{call.nextAction || "None"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Flagged for Review</div>
                        <div className="text-sm font-medium">{call.flagged ? "Yes" : "No"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Contains Sensitive Info</div>
                        <div className="text-sm font-medium">{call.containsSensitiveInfoOverall ? "Yes" : "No"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Transcript Available</div>
                        <div className="text-sm font-medium">{call.transcriptAvailable ? "Yes" : "No"}</div>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium mt-6 mb-4">Key Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(call.keyTopics || {}).map(([topic, count]) => (
                        <Badge key={topic} variant="outline" className="bg-muted/30">
                          {topic} ({count})
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-background dark:bg-muted/20 p-6 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-4">Call Summary</h3>
                  <p className="text-sm">{call.notes || "No summary available."}</p>
                </div>
              </div>
            )}

            {activeTab === "transcript" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Call Transcript</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-4 w-4" /> <span>Download Transcript</span>
                    </Button>
                  </div>
                </div>
                <Tabs defaultValue="transcript-content" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="transcript-content">Transcript</TabsTrigger>
                    <TabsTrigger value="key-topics">Key Topics</TabsTrigger>
                    <TabsTrigger value="sentiment">Customer & Agent Sentiments</TabsTrigger>
                  </TabsList>
                  <TabsContent value="transcript-content" className="mt-0">
                    <div className="bg-background dark:bg-muted/20 p-6 rounded-lg border shadow-sm">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                        <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
                          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search transcript..."
                            value={transcriptSearchTerm}
                            onChange={(e) => setTranscriptSearchTerm(e.target.value)}
                            className="pl-8 w-full sm:w-[300px]"
                          />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Button variant="ghost" size="sm" className="text-xs h-7">
                            Show Original
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs h-7">
                            Show Translation
                          </Button>
                          <Button
                            variant={showSensitive ? "secondary" : "outline"}
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => setShowSensitive(!showSensitive)}
                          >
                            {showSensitive ? "Hide Sensitive Info" : "Show Sensitive Info"}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-6">
                        {filteredTranscript.length > 0 ? (
                          filteredTranscript.map((entry) => renderTranscriptEntry(entry))
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            {transcriptSearchTerm
                              ? "No matching statements found in transcript."
                              : "No transcript data available for this call."}
                          </p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="key-topics" className="mt-0">
                    <div className="bg-background dark:bg-muted/20 p-6 rounded-lg border shadow-sm">
                      <h4 className="text-base font-medium mb-4">Key Topics Analysis</h4>
                      <p>Key topics analysis will be shown here.</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="sentiment" className="mt-0">
                    <div className="bg-background dark:bg-muted/20 p-6 rounded-lg border shadow-sm">
                      <h4 className="text-base font-medium mb-4">Sentiment Analysis</h4>
                      <p>Sentiment analysis details will be shown here.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {activeTab === "metrics" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Call Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-background dark:bg-muted/20 p-6 rounded-lg border shadow-sm">
                    <h4 className="text-base font-medium mb-4">Talk Time Distribution</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Agent</span> <span>{call.agentTalkTime || 0}%</span>
                        </div>
                        <Progress value={call.agentTalkTime || 0} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Customer</span> <span>{100 - (call.agentTalkTime || 0)}%</span>
                        </div>
                        <Progress value={100 - (call.agentTalkTime || 0)} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Silence</span>
                          <span> {Math.round(((call.silenceDuration || 0) / durationInSeconds) * 100)}% </span>
                        </div>
                        <Progress
                          value={Math.round(((call.silenceDuration || 0) / durationInSeconds) * 100)}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-background dark:bg-muted/20 p-6 rounded-lg border shadow-sm">
                    <h4 className="text-base font-medium mb-4">Call Quality Metrics</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Compliance</span> <span>{call.complianceScore || 0}%</span>
                        </div>
                        <Progress value={call.complianceScore || 0} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Clarity</span> <span>95%</span>
                        </div>
                        <Progress value={95} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Resolution Efficiency</span> <span>90%</span>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-background dark:bg-muted/20 p-6 rounded-lg border shadow-sm">
                  <h4 className="text-base font-medium mb-4">Call Timeline</h4>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted"></div>
                    <div className="space-y-6">
                      <div className="relative pl-10">
                        <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium">00:00</span>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium">Call Started</h5>
                          <p className="text-xs text-muted-foreground">Agent greeted customer</p>
                        </div>
                      </div>
                      <div className="relative pl-10">
                        <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium">12:34</span>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium">Call Ended</h5>
                          <p className="text-xs text-muted-foreground">Issue resolved</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  )
}
