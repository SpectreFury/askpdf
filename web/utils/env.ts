const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

export const urls = {
  LOGIN_URL: `${SERVER_URL}/auth/login`,
  SIGNUP_URL: `${SERVER_URL}/auth/signup`,
  GET_USER_URL: `${SERVER_URL}/auth/me`
};
