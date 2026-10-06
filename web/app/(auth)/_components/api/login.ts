import { APIResponse } from "@/types/api";
import { urls } from "@/utils/env";

export type ValueProps = {
  email: string;
  password: string;
};

export const login = async (value: ValueProps) => {
  const response = await fetch(urls.LOGIN_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: value.email,
      password: value.password,
    }),
  });

  const result = (await response.json()) as APIResponse;
  if (!result.success) throw new Error(result.error);

  localStorage.setItem("access_token", result.data.access_token);
};
