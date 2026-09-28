'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dot, File } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SessionListItem } from "@/types/session";

type SessionsListItemProps = {
  session: SessionListItem;
};

function formatDate(value: string) {
  const date = new Date(value);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) return "Today";

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const SessionsListItem = ({ session }: SessionsListItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === `/workspace/${session.session_id}`;

  return (
    <li>
      <Link
        href={`/workspace/${session.session_id}`}
        className={cn(
          "flex items-center gap-4 rounded-md border bg-card p-4 transition-colors hover:bg-secondary/10",
          isActive && "border-primary/50 bg-secondary/20"
        )}
      >
        <div className="rounded-md bg-secondary/10 p-2">
          <File size={20} className="text-primary" />
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="truncate text-sm font-medium">{session.title}</div>
          <div className="flex items-center text-xs text-secondary">
            <div>
              {session.page_count
                ? `${session.page_count} pages`
                : "Processing"}
            </div>
            <Dot />
            <div>{formatDate(session.created_at)}</div>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default SessionsListItem;
