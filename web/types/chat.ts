export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  // Client-only lifecycle for an in flight round trip.
  status?: "pending" | "error";
};

export type MessageResponse = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export type AskQuestionData = {
  answer: string;
};
