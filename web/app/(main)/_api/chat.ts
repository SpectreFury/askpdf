import { urls } from "@/utils/env";
import { fetchWithInterceptor } from "@/utils/fetch-interceptor";
import type { APIResponseOf } from "@/types/api";
import type { AskQuestionData } from "@/types/chat";

export const askQuestion = async (
  sessionId: string,
  question: string,
  citationsOnly: boolean
) => {
  const response = await fetchWithInterceptor(urls.ASK_QUESTION(sessionId), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, citations_only: citationsOnly }),
  });

  if (!response.ok) throw new Error("Unable to send question");

  return (await response.json()) as APIResponseOf<AskQuestionData>;
};

export const fetchSuggestedQuestions = async (sessionId: string) => {
  const response = await fetchWithInterceptor(
    urls.SUGGESTED_QUESTIONS(sessionId),
    { credentials: "include" }
  );

  if (!response.ok) throw new Error("Unable to load suggested questions");

  return (await response.json()) as APIResponseOf<string[]>;
};
