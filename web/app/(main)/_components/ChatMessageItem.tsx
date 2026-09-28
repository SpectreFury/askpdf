'use client';

import { LoaderCircle, Sparkles } from "lucide-react";
import type { ChatMessage, Citation } from "@/types/chat";

type ChatMessageItemProps = {
  message: ChatMessage;
};

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function citationLabel(citation: Citation) {
  const page = `Page ${citation.page}`;

  return citation.paragraph === null
    ? page
    : `${page}, Paragraph ${citation.paragraph}`;
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

      {message.citations.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-secondary">Citations:</span>
          {message.citations.map((citation, index) => (
            <span
              key={`${citation.page}-${citation.paragraph ?? index}`}
              className="rounded border border-border bg-secondary/10 px-1.5 py-0.5 text-[10px] text-secondary"
            >
              {citationLabel(citation)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatMessageItem;
