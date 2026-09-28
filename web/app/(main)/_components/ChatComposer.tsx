'use client';

import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type ChatComposerProps = {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  isPending?: boolean;
  placeholder: string;
};

const ChatComposer = ({
  value,
  onValueChange,
  onSubmit,
  isPending = false,
  placeholder,
}: ChatComposerProps) => {
  const canSubmit = value.trim().length > 0 && !isPending;

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <textarea
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (canSubmit) onSubmit();
          }
        }}
        rows={2}
        placeholder={placeholder}
        className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-secondary"
      />

      <div className="mt-2 flex items-center justify-end gap-2">
        <Button
          type="button"
          size="icon"
          onClick={onSubmit}
          disabled={!canSubmit}
          aria-label="Send question"
        >
          <ArrowUp />
        </Button>
      </div>
    </div>
  );
};

export default ChatComposer;
