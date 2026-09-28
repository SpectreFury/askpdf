const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

export const urls = {
  // AUTH
  LOGIN_URL: `${SERVER_URL}/auth/login`,
  SIGNUP_URL: `${SERVER_URL}/auth/signup`,
  GET_USER_URL: `${SERVER_URL}/auth/me`,
  REFRESH: `${SERVER_URL}/auth/refresh`,
  LOGOUT: `${SERVER_URL}/auth/refresh/delete`,

  // UPLOAD
  PRESIGNED_URL: `${SERVER_URL}/upload/generate-presigned-url`,

  // SESSION
  CREATE_SESSION: `${SERVER_URL}/session`,
  LIST_SESSIONS: `${SERVER_URL}/session`,
  GET_SESSION: (sessionId: string) => `${SERVER_URL}/session/${sessionId}`,

  // CHAT
  ASK_QUESTION: (sessionId: string) => `${SERVER_URL}/session/${sessionId}/ask`,
  SUGGESTED_QUESTIONS: (sessionId: string) =>
    `${SERVER_URL}/session/${sessionId}/suggestions`
};
