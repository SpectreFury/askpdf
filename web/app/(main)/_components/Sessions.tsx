'use client';

import { useQuery } from "@tanstack/react-query";
import { fetchSessions } from "../_api/workspace";
import SessionsListItem from "./SessionsListItem";

const Sessions = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
  });

  const sessions = data?.data ?? [];

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between">
        <p className="uppercase text-xs font-medium text-secondary">
          Document Library
        </p>
        <span className="text-xs font-medium text-secondary/80">
          {sessions.length} {sessions.length === 1 ? "file" : "files"}
        </span>
      </div>

      {isPending && (
        <p className="mt-3 text-xs text-secondary">Loading library...</p>
      )}

      {isError && (
        <p className="mt-3 text-xs text-secondary">
          Unable to load your documents.
        </p>
      )}

      {sessions.length > 0 && (
        <ul className="mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pb-1 pr-1">
          {sessions.map((session) => (
            <SessionsListItem key={session.session_id} session={session} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sessions;
