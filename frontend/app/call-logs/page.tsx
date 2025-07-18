"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Filter,
  MoreHorizontal,
  Phone,
  BarChart3,
  Clock,
  Flag,
  ArrowUpRight,
  Download,
  ChevronDown,
  ArrowRight,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog } from "@/components/ui/dialog"
import CallDetailsDialog from "@/components/call-details-dialog"
import type { Call } from "@/types" // <-- IMPORTING CENTRALIZED TYPE

const initialCallsData: Call[] = [
  {
    id: "CALL-1001",
    date: "2023-06-15",
    time: "09:23:45",
    duration: "12:34",
    direction: "Inbound",
    caller: "+92 301 1234567",
    agent: "Fatima Zaidi",
    outcome: "Resolved",
    customerSentiment: "Positive",
    agentSentiment: "Empathetic",
    flagged: false,
    notes: "Customer inquired about mobile package billing cycle and received explanation about charges",
    tags: ["Billing", "Service Upgrade", "Discount"],
    agentTalkTime: 42,
    silenceDuration: 18,
    interruptions: 2,
    complianceScore: 98,
    keyTopics: {
      Billing: 5,
      "Service Upgrade": 3,
      Discount: 2,
    },
    clientId: "CLIENT-001",
    nextAction: "Follow-up email sent.",
    containsSensitiveInfoOverall: true,
    transcriptAvailable: true,
    transcriptEntries: [
      {
        id: "t1",
        speaker: "Agent",
        speakerName: "Fatima Zaidi",
        timestamp: "00:05",
        originalText: "آداب، کسٹمر سروس میں خوش آمدید۔ میرا نام فاطمہ ہے۔ میں آپ کی کیسے مدد کر سکتی ہوں؟",
        translatedText: "Hello, welcome to customer service. My name is Fatima. How may I help you today?",
        tags: [{ type: "info", text: "Greeting" }],
      },
      {
        id: "t2",
        speaker: "Customer",
        speakerName: "Customer",
        timestamp: "00:12",
        originalText: "جی ہاں، میں اپنے موبائل پیکیج کے بل کے بارے میں کال کر رہا ہوں۔",
        translatedText: "Yes, I'm calling about my mobile package billing.",
        tags: [{ type: "topic", text: "Billing Issue" }],
      },
      {
        id: "t4",
        speaker: "Customer",
        speakerName: "Customer",
        timestamp: "00:35",
        originalText: `جی ہاں، میرا نمبر +92 301 1234567 ہے۔`,
        translatedText: `Yes, it's +92 301 1234567.`,
        isSensitive: true,
        sensitivePlaceholder: `Yes, it's [Phone Number Masked].`,
      },
    ],
  },
  {
    id: "CALL-1002",
    date: "2023-06-15",
    time: "10:45:12",
    duration: "08:22",
    direction: "Outbound",
    caller: "+92 333 9876543",
    agent: "Muhammad Ahmed",
    outcome: "Escalated",
    customerSentiment: "Negative",
    agentSentiment: "Frustrated",
    flagged: true,
    notes: "Customer expressed dissatisfaction with network quality in Lahore area and requested manager intervention",
    tags: ["Service Complaint", "Refund Request", "Manager Escalation"],
  },
  {
    id: "CALL-1003",
    date: "2023-06-15",
    time: "11:30:00",
    duration: "03:45",
    direction: "Inbound",
    caller: "+92 321 5678901",
    agent: "Zainab Khan",
    outcome: "Dropped",
    customerSentiment: "Neutral",
    agentSentiment: "Professional",
    flagged: true,
    notes: "Call dropped while troubleshooting customer's internet connection issues in rural area",
    tags: ["Technical Issue", "Connection Problem", "Troubleshooting"],
  },
  {
    id: "CALL-1004",
    date: "2023-06-15",
    time: "13:15:22",
    duration: "06:18",
    direction: "Inbound",
    caller: "+92 345 7890123",
    agent: "Ali Hassan",
    outcome: "Resolved",
    customerSentiment: "Positive",
    agentSentiment: "Empathetic",
    flagged: false,
    notes: "Customer requested information about international roaming packages and completed activation",
    tags: ["Roaming", "Package Activation", "International"],
  },
  {
    id: "CALL-1005",
    date: "2023-06-15",
    time: "14:42:10",
    duration: "10:05",
    direction: "Inbound",
    caller: "+92 312 3456789",
    agent: "Ayesha Malik",
    outcome: "Escalated",
    customerSentiment: "Negative",
    agentSentiment: "Professional",
    flagged: true,
    notes: "Customer complained about repeated billing errors and requested supervisor review",
    tags: ["Billing Error", "Supervisor Request", "Recurring Issue"],
  },
]

export default function CallLogs() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCall, setSelectedCall] = useState<Call | null>(null)

  const handleOpenDialog = (call: Call) => {
    setSelectedCall(call)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedCall(null)
  }

  return (
    <>
      <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Call Logs</h2>
            <p className="text-muted-foreground mt-1">View and analyze your recent call recordings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Calls</p>
                <div className="text-3xl font-bold mt-1">247</div>
                <div className="flex items-center mt-1 text-xs text-green-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>12% vs. yesterday</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-800/30 flex items-center justify-center">
                <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved Rate</p>
                <div className="text-3xl font-bold mt-1">33%</div>
                <div className="flex items-center mt-1 text-xs text-green-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>5% vs. yesterday</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-800/30 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Duration</p>
                <div className="text-3xl font-bold mt-1">8:14</div>
                <div className="flex items-center mt-1 text-xs text-red-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>8% vs. yesterday</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-800/30 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Flagged Calls</p>
                <div className="text-3xl font-bold mt-1">18</div>
                <div className="flex items-center mt-1 text-xs text-red-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>2% vs. yesterday</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-800/30 flex items-center justify-center">
                <Flag className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="card-hover">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Call Records</CardTitle>
                <CardDescription>Analyze call metrics, sentiment, and outcomes</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search calls..."
                    className="pl-8 w-full sm:w-[200px] md:w-[300px]"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-1">
                      <Filter className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Advanced Filters</span>
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[220px]">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Checkbox id="direction" className="mr-2" />
                      <label htmlFor="direction">Direction</label>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Checkbox id="outcome" className="mr-2" />
                      <label htmlFor="outcome">Call Outcome</label>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Checkbox id="sentiment" className="mr-2" />
                      <label htmlFor="sentiment">Customer Sentiment</label>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Checkbox id="flagged" className="mr-2" />
                      <label htmlFor="flagged">Flagged Calls</label>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Button variant="outline" size="sm" className="w-full">
                        Apply Filters
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[30px]">
                      <Checkbox id="select-all" />
                    </TableHead>
                    <TableHead>Call ID</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Caller</TableHead>
                    <TableHead>Callee / Agent</TableHead>
                    <TableHead>Call Outcome</TableHead>
                    <TableHead>Customer Sentiment</TableHead>
                    <TableHead>Agent Sentiment</TableHead>
                    <TableHead>Flagged</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialCallsData.map((call) => (
                    <TableRow key={call.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <Checkbox id={`select-${call.id}`} />
                      </TableCell>
                      <TableCell className="font-medium">
                        <Button
                          variant="link"
                          className="p-0 h-auto font-medium"
                          onClick={() => handleOpenDialog(call)}
                        >
                          <div className="flex items-center gap-1">
                            <span className="text-primary">{call.id}</span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {call.date}
                          <br />
                          <span className="text-muted-foreground text-xs">{call.time}</span>
                        </div>
                      </TableCell>
                      <TableCell>{call.duration}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${
                            call.direction === "Inbound"
                              ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30"
                              : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30"
                          }`}
                        >
                          {call.direction}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{call.caller}</TableCell>
                      <TableCell>{call.agent}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${
                            call.outcome === "Resolved"
                              ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30"
                              : call.outcome === "Escalated"
                                ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30"
                                : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800/30"
                          }`}
                        >
                          {call.outcome}
                        </Badge>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {call.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[10px] py-0 px-1">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`flex items-center ${
                            call.customerSentiment === "Positive"
                              ? "text-green-600"
                              : call.customerSentiment === "Negative"
                                ? "text-red-600"
                                : "text-gray-600"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-1 ${
                              call.customerSentiment === "Positive"
                                ? "bg-green-500"
                                : call.customerSentiment === "Negative"
                                  ? "bg-red-500"
                                  : "bg-gray-500"
                            }`}
                          ></div>
                          {call.customerSentiment}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{call.notes}</div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`flex items-center ${
                            call.agentSentiment === "Empathetic"
                              ? "text-green-600"
                              : call.agentSentiment === "Frustrated"
                                ? "text-red-600"
                                : "text-blue-600"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-1 ${
                              call.agentSentiment === "Empathetic"
                                ? "bg-green-500"
                                : call.agentSentiment === "Frustrated"
                                  ? "bg-red-500"
                                  : "bg-blue-500"
                            }`}
                          ></div>
                          {call.agentSentiment}
                        </div>
                      </TableCell>
                      <TableCell>
                        {call.flagged ? (
                          <Badge variant="destructive" className="text-xs">
                            Yes
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">No</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View call details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">Showing {initialCallsData.length} of 247 calls</div>
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

      {selectedCall && (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <CallDetailsDialog call={selectedCall} />
        </Dialog>
      )}
    </>
  )
}
