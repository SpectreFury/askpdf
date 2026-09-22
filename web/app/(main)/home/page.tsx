"use client";

import { useEffect } from "react";
import ConversationAside from "../_components/ConversationAside";
import DocumentRenderer from "../_components/DocumentRenderer";
import DocumentUploadAside from "../_components/DocumentUploadAside";
import { urls } from "@/utils/env";

const HomePage = () => {
  return (
    <main className="w-full h-screen bg-[#FAF9F6] flex">
      <DocumentUploadAside />

      <DocumentRenderer />

      <ConversationAside />
    </main>
  );
};

export default HomePage;
