"use client";

import ConversationAside from "../_components/ConversationAside";
import DocumentRenderer from "../_components/DocumentRenderer";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../_api/home";

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
    <>
      <DocumentRenderer />
      <ConversationAside />
    </>
  );
};

export default WorkspacePage;
