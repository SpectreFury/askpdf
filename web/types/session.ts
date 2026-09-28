export type SessionResponse = {
  session_id: string;
  title: string;
  document_id: string;
  document_url: string;
};

export type SessionListItem = {
  session_id: string;
  title: string;
  page_count: number | null;
  created_at: string;
};
