"use client";

import ConversationAside from "../_components/ConversationAside";
import DocumentRenderer from "../_components/DocumentRenderer";
import DocumentUploadAside from "../_components/DocumentUploadAside";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../_api/home";

const HomePage = () => {
  const { data, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  console.log("isPending: ", isPending, " data: ", data);

  return (
    <main className="w-full h-screen bg-[#FAF9F6] flex">
      <DocumentUploadAside user={data.data} />

      <DocumentRenderer />

      <ConversationAside />
    </main>
  );
};

export default HomePage;
