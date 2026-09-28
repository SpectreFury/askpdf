import { urls } from "@/utils/env";
import { fetchWithInterceptor } from "@/utils/fetch-interceptor";
import type { APIResponseOf } from "@/types/api";
import type { AskQuestionData, MessageResponse } from "@/types/chat";

// Failures are explained by the server, for example a document that is still
// being ingested, so surface the envelope message instead of a generic failure.
async function readError(response: Response) {
  try {
    const result = (await response.json()) as APIResponseOf<unknown>;

    return result?.error || "Something went wrong.";
  } catch {
    return "Something went wrong.";
  }
}

export const askQuestion = async (sessionId: string, question: string) => {
  const response = await fetchWithInterceptor(urls.ASK_QUESTION(sessionId), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) throw new Error(await readError(response));

  return (await response.json()) as APIResponseOf<AskQuestionData>;
};

export const fetchMessages = async (sessionId: string) => {
  const response = await fetchWithInterceptor(urls.MESSAGES(sessionId), {
    credentials: "include",
  });

  if (!response.ok) throw new Error(await readError(response));

  return (await response.json()) as APIResponseOf<MessageResponse[]>;
};

export const fetchSuggestedQuestions = async (sessionId: string) => {
  const response = await fetchWithInterceptor(
    urls.SUGGESTED_QUESTIONS(sessionId),
    { credentials: "include" }
  );

  if (!response.ok) throw new Error(await readError(response));

  return (await response.json()) as APIResponseOf<string[]>;
};
