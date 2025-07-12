"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatMessage } from "@/components/chat-message"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

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
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant. How can I help you with your banking queries today?",
      isUser: false,
      timestamp: "Just now",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const prepromptOptions: PrepromptOption[] = [
    {
      id: "billing",
      title: "Billing Issues",
      icon: "💰",
      prompt: "I have a question about charges on my account",
    },
    {
      id: "products",
      title: "Product Info",
      icon: "📱",
      prompt: "Tell me about your banking products",
    },
    {
      id: "support",
      title: "Customer Support",
      icon: "🛟",
      prompt: "I need help with my account",
    },
    {
      id: "rates",
      title: "Interest Rates",
      icon: "📊",
      prompt: "What are the current interest rates?",
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

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(content),
        isUser: false,
        timestamp: "Just now",
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const getAIResponse = (userMessage: string): string => {
    // Simple response logic - in a real app, this would call an AI API
    if (userMessage.toLowerCase().includes("billing") || userMessage.toLowerCase().includes("charges")) {
      return "I can help you with billing issues. Could you please provide your account number or the specific charge you're inquiring about?"
    } else if (userMessage.toLowerCase().includes("product")) {
      return "We offer various banking products including savings accounts, credit cards, personal loans, mortgages, and investment options. Which specific product would you like to learn more about?"
    } else if (userMessage.toLowerCase().includes("support") || userMessage.toLowerCase().includes("help")) {
      return "I'm here to help! Please let me know what specific issue you're facing with your account, and I'll guide you through the resolution process."
    } else if (userMessage.toLowerCase().includes("interest") || userMessage.toLowerCase().includes("rates")) {
      return "Our current interest rates are: Savings Accounts: 3.5%, Personal Loans: 9.75%, Mortgages: starting at 6.25%. Rates may vary based on your account type and credit history."
    }
    return "Thank you for your message. How else can I assist you with your banking needs today?"
  }

  const handlePrepromptClick = (prompt: string) => {
    handleSendMessage(prompt)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-80 md:w-96 shadow-lg border-primary/10">
          <CardHeader className="p-4 border-b flex flex-row justify-between items-center bg-primary/5">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium text-sm">Banking Assistant</h3>
                <p className="text-xs text-muted-foreground">Ask me anything about your banking needs</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {prepromptOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    size="sm"
                    className="h-auto py-1 px-2 text-xs flex items-center gap-1"
                    onClick={() => handlePrepromptClick(option.prompt)}
                  >
                    <span>{option.icon}</span>
                    <span>{option.title}</span>
                  </Button>
                ))}
              </div>
              <ScrollArea className="h-[300px] pr-4">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message.content}
                    isUser={message.isUser}
                    timestamp={message.timestamp}
                  />
                ))}
                <div ref={messagesEndRef} />
              </ScrollArea>
            </div>
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
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary animate-pulse">
              Need help? Chat with AI
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
