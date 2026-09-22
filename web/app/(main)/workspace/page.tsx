"use client";

import ConversationAside from "../_components/ConversationAside";
import DocumentRenderer from "../_components/DocumentRenderer";
import DocumentUploadAside from "../_components/DocumentUploadAside";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../_api/home";
import { User } from "@/types/home";

const WorkspacePage = () => {
  const { data, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  console.log("isPending: ", isPending, " data: ", data);

  if (isPending) {
    return <div>Loader</div>;
  }

  return (
    <main className="w-full h-screen bg-[#FAF9F6] flex">
      <DocumentRenderer />
      <ConversationAside />
    </main>
  );
};

export default WorkspacePage;
