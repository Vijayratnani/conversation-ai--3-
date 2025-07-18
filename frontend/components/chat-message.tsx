import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type ChatMessageProps = {
  message: string
  isUser: boolean
  timestamp: string
}

export function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  return (
    <div className={cn("flex w-full gap-2 mb-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" />
          <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
        </Avatar>
      )}
      <div className={cn("flex flex-col max-w-[80%]", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-lg px-4 py-2 text-sm",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted border border-border",
          )}
        >
          {message.split("\n").map((line, i) => (
            <div key={i} className={i > 0 ? "mt-1" : ""}>
              {line}
            </div>
          ))}
        </div>
        <span className="text-xs text-muted-foreground mt-1">{timestamp}</span>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" />
          <AvatarFallback className="bg-muted text-muted-foreground">U</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
