import { urls } from "@/utils/env"
import { fetchWithInterceptor } from "@/utils/fetch-interceptor"

export const uploadFile = async (file: File) => {
  // Get the presigned url
  const response = await fetchWithInterceptor(urls.PRESIGNED_URL, {
    method: "POST",
    credentials: "include"
  })

  if(!response.ok) throw new Error("Unable to upload file")

  const result = await response.json();

  const {timestamp, cloud_name, signature, api_key, folder} = result.data
  console.log(result.data)

  const formData = new FormData();
  formData.append("file", file);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("api_key", api_key);
  formData.append("folder", folder);

  const url = `https://api.cloudinary.com/v1_1/${cloud_name}/raw/upload`
  const uploadResponse = await fetch(url, {
    method: "POST",
    body: formData,
  })

  if(!uploadResponse.ok) throw new Error("Unable to upload file")

  const uploadResult = await uploadResponse.json();
  console.log(uploadResult)
}
