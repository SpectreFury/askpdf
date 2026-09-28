export type APIResponse = {
  success: boolean;
  data: any;
  error: string;
};

export type APIResponseOf<T> = Omit<APIResponse, "data"> & { data: T };
