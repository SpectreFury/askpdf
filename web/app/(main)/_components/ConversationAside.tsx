'use client';

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessagesSquare, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  askQuestion,
  deleteMessages,
  fetchMessages,
  fetchSuggestedQuestions,
} from "../_api/chat";
import { fetchSession } from "../_api/workspace";
import type { APIResponseOf } from "@/types/api";
import type { ChatMessage, MessageResponse } from "@/types/chat";
import ChatComposer from "./ChatComposer";
import ChatMessageItem from "./ChatMessageItem";
import SuggestedQuestions from "./SuggestedQuestions";

type ConversationAsideProps = {
  sessionId: string;
};

type AskVariables = {
  question: string;
  citationsOnly: boolean;
};

const EMPTY_MESSAGES: APIResponseOf<MessageResponse[]> = {
  success: true,
  data: [],
  error: "",
};

const toChatMessage = (message: MessageResponse): ChatMessage => ({
  id: message.id,
  role: message.role,
  content: message.content,
  created_at: message.created_at,
  citations: message.citations,
});

const ConversationAside = ({ sessionId }: ConversationAsideProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [citationsOnly, setCitationsOnly] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const threadRef = useRef<HTMLDivElement>(null);
  const hydratedSession = useRef<string | null>(null);
  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => fetchSession(sessionId),
    enabled: Boolean(sessionId),
  });

  const { data: history } = useQuery({
    queryKey: ["messages", sessionId],
    queryFn: () => fetchMessages(sessionId),
    enabled: Boolean(sessionId),
  });

  const { data: suggestions } = useQuery({
    queryKey: ["suggestions", sessionId],
    queryFn: () => fetchSuggestedQuestions(sessionId),
    enabled: Boolean(sessionId),
  });

  // History is stored server side, so the thread comes back after a reload or a
  // navigation instead of starting empty.
  useEffect(() => {
    if (!history?.data || hydratedSession.current === sessionId) return;

    hydratedSession.current = sessionId;
    setMessages(history.data.map(toChatMessage));
  }, [history, sessionId]);

  useEffect(() => {
    const thread = threadRef.current;

    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [messages]);

  const askMutation = useMutation({
    mutationFn: ({ question, citationsOnly }: AskVariables) =>
      askQuestion(sessionId, question, citationsOnly),

    onMutate: ({ question }) => {
      setSendError(null);

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: question,
        created_at: new Date().toISOString(),
        citations: [],
      };

      const pendingMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        created_at: new Date().toISOString(),
        citations: [],
        status: "pending",
      };

      setMessages((current) => [...current, userMessage, pendingMessage]);
      setQuestion("");

      return { userId: userMessage.id, pendingId: pendingMessage.id, question };
    },

    onSuccess: (result, _variables, context) => {
      setMessages((current) =>
        current.map((message) =>
          message.id === context?.pendingId
            ? {
                ...message,
                content: result?.data?.answer ?? "",
                citations: result?.data?.citations ?? [],
                status: undefined,
              }
            : message
        )
      );
    },

    onError: (error, _variables, context) => {
      if (context) {
        setMessages((current) =>
          current
            .filter((message) => message.id !== context.pendingId)
            .map((message) =>
              message.id === context.userId
                ? { ...message, status: "error" }
                : message
            )
        );

        setQuestion(context.question);
      }

      setSendError(
        error instanceof Error
          ? error.message
          : "We couldn't send your question. Please try again."
      );
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => deleteMessages(sessionId),
    onSuccess: () => {
      queryClient.setQueryData(["messages", sessionId], EMPTY_MESSAGES);

      setMessages([]);
      setQuestion("");
      setSendError(null);
    },
    onError: () => setSendError("We couldn't clear this conversation."),
  });

  const submitQuestion = (nextQuestion: string) => {
    const trimmed = nextQuestion.trim();

    if (!trimmed) return;

    askMutation.mutate({ question: trimmed, citationsOnly });
  };

  return (
    <aside className="flex h-full min-h-0 w-96 min-w-96 shrink-0 flex-col gap-3 border-l bg-sidebar p-4">
      <div className="flex shrink-0 items-center gap-2">
        <MessagesSquare className="size-4 text-primary" />
        <span className="text-sm font-bold">Conversational Q&amp;A</span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => clearMutation.mutate()}
          disabled={messages.length === 0 || clearMutation.isPending}
          className="ml-auto cursor-pointer"
        >
          <RotateCcw />
          Reset
        </Button>
      </div>

      <div
        ref={threadRef}
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto"
      >
        {messages.length === 0 && (
          <p className="text-xs text-secondary">No questions yet.</p>
        )}

        {messages.map((message) => (
          <ChatMessageItem key={message.id} message={message} />
        ))}
      </div>

      {sendError && (
        <p className="shrink-0 text-xs text-destructive">{sendError}</p>
      )}

      <SuggestedQuestions
        questions={suggestions?.data ?? []}
        onSelect={submitQuestion}
        disabled={askMutation.isPending}
      />

      <ChatComposer
        value={question}
        onValueChange={setQuestion}
        citationsOnly={citationsOnly}
        onCitationsOnlyChange={setCitationsOnly}
        onSubmit={() => submitQuestion(question)}
        isPending={askMutation.isPending}
        placeholder={`Ask a question about ${
          session?.data?.title || "this document"
        }...`}
      />
    </aside>
  );
};

export default ConversationAside;
