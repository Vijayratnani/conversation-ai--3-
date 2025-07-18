// components/ui/DialogActions.tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReactNode } from "react";

interface DialogAction {
  trigger: {
    text: string;
    variant?: "default" | "outline" | "ghost";
    size?: "sm" | "default" | "lg";
    className?: string;
  };
  dialog: {
    title: string;
    maxWidth?: string;
    content: ReactNode;
  };
}

interface DialogActionsProps {
  actions: DialogAction[];
  className?: string;
}

export const DialogActions = ({ actions, className = "" }: DialogActionsProps) => {
  return (
    <div className={`flex justify-between items-center ${className}`}>
      {actions.map((action, index) => (
        <Dialog key={index}>
          <DialogTrigger asChild>
            <Button 
              variant={action.trigger.variant || "default"}
              size={action.trigger.size || "default"}
              className={action.trigger.className || ""}
            >
              {action.trigger.text}
            </Button>
          </DialogTrigger>
          <DialogContent className={action.dialog.maxWidth || "sm:max-w-[600px]"}>
            <DialogHeader>
              <DialogTitle>{action.dialog.title}</DialogTitle>
            </DialogHeader>
            {action.dialog.content}
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};