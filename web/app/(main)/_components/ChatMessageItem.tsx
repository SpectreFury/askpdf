'use client';

import { LoaderCircle, Sparkles } from "lucide-react";
import type { ChatMessage } from "@/types/chat";

type ChatMessageItemProps = {
  message: ChatMessage;
};

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

const ChatMessageItem = ({ message }: ChatMessageItemProps) => {
  if (message.role === "user") {
    return (
      <div className="flex flex-col gap-1">
        <p className="text-sm text-foreground">{message.content}</p>
        <div className="flex items-center gap-2 text-[10px] text-secondary">
          <span>{formatTime(message.created_at)}</span>
          {message.status === "error" && (
            <span className="text-destructive">Not sent</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center gap-2">
        <div className="grid size-6 place-items-center rounded bg-primary text-primary-foreground">
          <Sparkles className="size-3" />
        </div>
        <span className="text-sm font-medium">Assistant</span>
        <span className="text-[10px] text-secondary">
          {formatTime(message.created_at)}
        </span>
      </div>

      {message.status === "pending" ? (
        <div className="flex items-center gap-2 text-sm text-secondary">
          <LoaderCircle className="size-3.5 animate-spin" />
          Reading the document
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-foreground">
          {message.content}
        </p>
      )}
    </div>
  );
};

export default ChatMessageItem;
