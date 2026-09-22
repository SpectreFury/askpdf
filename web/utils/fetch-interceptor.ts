import { APIResponse } from "@/types/api";
import { urls } from "./env";

// Shared promise to prevent parallel refresh requests ("refresh storm")
let refreshTokenPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch(urls.REFRESH, {
      method: "POST",
      credentials: "include", // Sends HttpOnly cookie
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const result = (await response.json()) as APIResponse;
    const newAccessToken = result.data.access_token;

    localStorage.setItem("access_token", newAccessToken);
    return newAccessToken;
  } catch (error) {
    // Refresh failed -> clear session & redirect to login
    localStorage.removeItem("access_token");
    window.location.href = "/login";
    return null;
  } finally {
    // Reset queue lock after completion
    refreshTokenPromise = null;
  }
}

export async function fetchWithInterceptor(
  url: string | URL | Request,
  options: RequestInit = {}
): Promise<Response> {
  const getHeaders = (token: string | null) => {
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  };

  // 1. Send initial request with existing access token
  let accessToken = localStorage.getItem("access_token");
  let response = await fetch(url, {
    ...options,
    headers: getHeaders(accessToken),
  });

  // 2. Check if token is expired
  if (response.status === 401) {
    // Clone response so reading body doesn't lock it for downstream callers
    const clonedResponse = response.clone();

    try {
      const result = (await clonedResponse.json()) as APIResponse;

      if (result.error === "token_expired") {
        // 3. Queue concurrency: reuse active refresh promise if one is already in-flight
        if (!refreshTokenPromise) {
          refreshTokenPromise = refreshAccessToken();
        }

        const newAccessToken = await refreshTokenPromise;

        if (newAccessToken) {
          // 4. Retry the ORIGINAL failed request with the NEW token
          response = await fetch(url, {
            ...options,
            headers: getHeaders(newAccessToken),
          });
        }
      }
    } catch {
      // If 401 body wasn't JSON or didn't contain "token_expired", pass response through as-is
    }
  }

  return response;
}
