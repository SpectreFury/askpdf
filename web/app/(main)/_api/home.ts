import { urls } from "@/utils/env";
import { fetchWithInterceptor } from "@/utils/fetch-interceptor";

export async function fetchUser() {
  const response = await fetchWithInterceptor(urls.GET_USER_URL, {
    credentials: "include",
  });

  const result = await response.json();

  return result;
}
