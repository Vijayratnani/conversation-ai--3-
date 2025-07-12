"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import type { CallMentionDetail } from "@/types"

interface TopicCallListDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  topicUrdu: string | null
  mentions: CallMentionDetail[]
  onViewFullCall: (callId: string) => void
}

export function TopicCallListDialog({
  isOpen,
  onOpenChange,
  topicUrdu,
  mentions,
  onViewFullCall,
}: TopicCallListDialogProps) {
  if (!topicUrdu) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle>{topicUrdu} کے لیے تذکرے</DialogTitle>
          <DialogDescription>
            وہ کالز دکھائی جا رہی ہیں جہاں &quot;{topicUrdu}&quot; کا ذکر کیا گیا تھا۔ مزید تفصیلات کے لیے کال آئی ڈی پر
            کلک کریں۔
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pl-4">
          {mentions.length > 0 ? (
            <div className="space-y-4 py-4 text-right">
              {mentions.map((mention, index) => (
                <div key={index} className="p-4 border rounded-lg bg-muted/20">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-left" dir="ltr">
                      {mention.callDate}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        کال آئی ڈی:{" "}
                        <Button
                          variant="link"
                          className="p-0 h-auto text-sm"
                          onClick={() => onViewFullCall(mention.callId)}
                        >
                          {mention.callId}
                        </Button>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ایجنٹ: {mention.agentName} | کسٹمر: {mention.customerIdentifier}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm italic p-2 bg-background rounded-md">&quot;{mention.mentionSnippet}&quot;</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-sm text-muted-foreground text-center">
              اس موضوع کے لیے کوئی مخصوص تذکرے نہیں ملے، یا ڈیٹا ابھی تک لوڈ نہیں ہوا ہے۔
            </p>
          )}
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            بند کریں
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
