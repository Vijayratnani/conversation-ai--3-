"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Loader2, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatMessage } from "@/components/chat-message"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Message = {
  id: string
  content: string
  isUser: boolean
  timestamp: string
}

type PrepromptOption = {
  id: string
  title: string
  icon: string
  prompt: string
  description: string
  image?: string
}

export function AdvancedChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your call analytics assistant. Ask me anything about your call center data, agent performance, or customer sentiment.",
      isUser: false,
      timestamp: "Just now",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const prepromptOptions: PrepromptOption[] = [
    {
      id: "sentiment",
      title: "Sentiment Analysis",
      icon: "😊",
      prompt: "Show me the sentiment breakdown of recent calls",
      description: "Get insights on customer sentiment trends",
      image: "/placeholder.svg?height=80&width=120",
    },
    {
      id: "agent-performance",
      title: "Agent Performance",
      icon: "🎯",
      prompt: "Which agents have the highest performance scores?",
      description: "View top performing agents and metrics",
      image: "/placeholder.svg?height=80&width=120",
    },
    {
      id: "call-volume",
      title: "Call Volume",
      icon: "📊",
      prompt: "What's our call volume trend this month?",
      description: "Analyze call volume patterns and trends",
      image: "/placeholder.svg?height=80&width=120",
    },
    {
      id: "product-issues",
      title: "Product Issues",
      icon: "⚠️",
      prompt: "Which products have the most customer complaints?",
      description: "Identify problematic products and issues",
      image: "/placeholder.svg?height=80&width=120",
    },
    {
      id: "compliance",
      title: "Compliance Risks",
      icon: "🔒",
      prompt: "Show me compliance risk indicators",
      description: "Monitor regulatory compliance in calls",
      image: "/placeholder.svg?height=80&width=120",
    },
    {
      id: "customer-satisfaction",
      title: "Customer Satisfaction",
      icon: "⭐",
      prompt: "What's our current CSAT score?",
      description: "Track customer satisfaction metrics",
      image: "/placeholder.svg?height=80&width=120",
    },
  ]

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: "Just now",
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(content),
        isUser: false,
        timestamp: "Just now",
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const getAIResponse = (userMessage: string): string => {
    // Call analytics focused responses
    const lowerCaseMessage = userMessage.toLowerCase()

    if (
      lowerCaseMessage.includes("sentiment") ||
      lowerCaseMessage.includes("emotion") ||
      lowerCaseMessage.includes("feeling")
    ) {
      return "Based on our call analytics for the past 30 days:\n\n• Positive sentiment: 42%\n• Neutral sentiment: 33%\n• Negative sentiment: 25%\n\nCredit Cards have the highest negative sentiment (45%), primarily due to hidden fees and interest rate concerns. Would you like to see a detailed breakdown by product?"
    } else if (
      lowerCaseMessage.includes("agent performance") ||
      lowerCaseMessage.includes("best agent") ||
      lowerCaseMessage.includes("top agent")
    ) {
      return "Our top performing agents this month are:\n\n1. Sarah K. (94% quality score)\n2. Michael R. (92% quality score)\n3. Jessica T. (91% quality score)\n\nSarah specializes in Credit Cards and has the highest customer satisfaction rating. Would you like to see more performance metrics for these agents?"
    } else if (lowerCaseMessage.includes("call volume") || lowerCaseMessage.includes("number of calls")) {
      return "Call volume this month: 247 calls\n\nThis represents a 12% increase compared to last month. Peak call times are between 10am-12pm and 2pm-4pm. The average call duration is 8 minutes and 14 seconds. Would you like to see the call volume breakdown by product or time of day?"
    } else if (
      lowerCaseMessage.includes("product") ||
      lowerCaseMessage.includes("issue") ||
      lowerCaseMessage.includes("complaint")
    ) {
      return "Products with the most customer issues:\n\n1. Credit Cards (42% of complaints)\n2. Personal Loans (35% of complaints)\n3. Savings Accounts (28% of complaints)\n\nFor Credit Cards, the top issues are: hidden fees (38%), interest rates (32%), and customer service (30%). Would you like recommendations for addressing these issues?"
    } else if (
      lowerCaseMessage.includes("compliance") ||
      lowerCaseMessage.includes("risk") ||
      lowerCaseMessage.includes("regulatory")
    ) {
      return "Current compliance risk indicators:\n\n• Disclosure phrase missing in 18% of calls (↑4% from last month)\n• Required disclaimers skipped in 7% of calls\n• Identity verification incomplete in 3% of calls\n\nHighest risk area: Credit Card sales calls. Would you like to see the agents who need compliance training?"
    } else if (
      lowerCaseMessage.includes("satisfaction") ||
      lowerCaseMessage.includes("csat") ||
      lowerCaseMessage.includes("happy")
    ) {
      return "Current customer satisfaction metrics:\n\n• CSAT Score: 4.2/5 (↑0.3 from last quarter)\n• Net Promoter Score (NPS): 42 (↑5 from last quarter)\n• Customer Effort Score: 2.3/5 (lower is better)\n\nSavings Accounts have the highest satisfaction (4.6/5), while Credit Cards have the lowest (3.8/5). Would you like recommendations for improving customer satisfaction?"
    } else if (
      lowerCaseMessage.includes("frustrat") ||
      lowerCaseMessage.includes("angry") ||
      lowerCaseMessage.includes("upset")
    ) {
      return "In the past 30 days, we've detected:\n\n• 43 calls with high customer frustration (17% of total calls)\n• 28 calls with moderate frustration (11% of total calls)\n\nMost common causes of frustration:\n1. Long wait times (32%)\n2. Repeated information requests (27%)\n3. Unclear explanations (21%)\n\nWould you like to see which agents handle frustrated customers most effectively?"
    } else if (
      lowerCaseMessage.includes("escalat") ||
      lowerCaseMessage.includes("supervisor") ||
      lowerCaseMessage.includes("manager")
    ) {
      return "Call escalation statistics:\n\n• 18 calls escalated to supervisors (7% of total calls)\n• Average time before escalation: 6:42 minutes\n• Most common reason: Policy exceptions (42%)\n\nCredit Card disputes have the highest escalation rate (12%). Would you like to see which agents have the lowest escalation rates?"
    } else if (
      lowerCaseMessage.includes("handle time") ||
      lowerCaseMessage.includes("call duration") ||
      lowerCaseMessage.includes("talk time")
    ) {
      return "Average handle time metrics:\n\n• Overall average: 8:14 minutes\n• Credit Cards: 9:32 minutes\n• Personal Loans: 12:18 minutes\n• Savings Accounts: 5:45 minutes\n\nAgent Michael R. has the shortest average handle time (6:22) while maintaining a 92% quality score. Would you like tips for reducing handle time without affecting quality?"
    } else if (
      lowerCaseMessage.includes("cross-sell") ||
      lowerCaseMessage.includes("upsell") ||
      lowerCaseMessage.includes("sales")
    ) {
      return "Cross-sell effectiveness:\n\n• Overall success rate: 18%\n• Most successful: Credit Card → Investment Products (32%)\n• Least successful: Mortgage → Personal Loans (8%)\n\n43 missed sales opportunities were identified through keyword analysis. Would you like to see the recommended cross-sell opportunities based on customer profiles?"
    }

    return "I can help you analyze your call center data. You can ask me about:\n\n• Sentiment analysis and customer emotions\n• Agent performance metrics\n• Call volume trends\n• Product-specific issues\n• Compliance risks\n• Customer satisfaction scores\n• Call handling metrics\n\nWhat specific insights would you like to see?"
  }

  const handlePrepromptClick = (prompt: string) => {
    handleSendMessage(prompt)
    setActiveTab("chat")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-80 md:w-96 shadow-lg border-primary/10">
          <CardHeader className="p-4 border-b flex flex-row justify-between items-center bg-primary/5">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-primary">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <BarChart3 className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-sm">Call Analytics Assistant</h3>
                <p className="text-xs text-muted-foreground">Ask about call data & insights</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b">
              <TabsList className="w-full rounded-none h-10 bg-transparent border-b">
                <TabsTrigger value="chat" className="flex-1 data-[state=active]:bg-transparent">
                  Chat
                </TabsTrigger>
                <TabsTrigger value="help" className="flex-1 data-[state=active]:bg-transparent">
                  Analytics Queries
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="chat" className="p-0 m-0">
              <CardContent className="p-0">
                <ScrollArea className="h-[350px] p-4">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message.content}
                      isUser={message.isUser}
                      timestamp={message.timestamp}
                    />
                  ))}
                  {isTyping && (
                    <div className="flex w-full gap-2 mb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col max-w-[80%]">
                        <div className="rounded-lg px-4 py-2 text-sm bg-muted border border-border">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-3 border-t">
                <form
                  className="flex w-full gap-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage(inputValue)
                  }}
                >
                  <Input
                    placeholder="Ask about call analytics..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!inputValue.trim() || isTyping}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </TabsContent>
            <TabsContent value="help" className="p-0 m-0">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {prepromptOptions.map((option) => (
                    <Card
                      key={option.id}
                      className="overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => handlePrepromptClick(option.prompt)}
                    >
                      <div className="aspect-[3/2] bg-muted/50 relative">
                        {option.image && (
                          <img
                            src={option.image || "/placeholder.svg"}
                            alt={option.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-lg">
                          <span>{option.icon}</span>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm">{option.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{option.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-3 border-t flex justify-center">
                <Button variant="outline" size="sm" onClick={() => setActiveTab("chat")}>
                  Return to Chat
                </Button>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>
      ) : (
        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary animate-pulse">
              Ask about call analytics
            </Badge>
            <Button
              onClick={() => setIsOpen(true)}
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
            >
              <MessageCircle className="h-6 w-6 text-primary-foreground" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
