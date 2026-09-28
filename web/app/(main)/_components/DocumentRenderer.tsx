'use client';

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { fetchSession } from "../_api/workspace";

// react-pdf pulls in pdfjs-dist/web/pdf_viewer.mjs, which touches `window`/`document`
// at module scope, so it can only ever be imported in the browser.
const PdfViewer = dynamic(() => import("./PdfViewer"), { ssr: false });

type DocumentRendererProps = {
  sessionId: string;
};

const DocumentRenderer = ({ sessionId }: DocumentRendererProps) => {
  const { data, isError } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => fetchSession(sessionId),
    enabled: Boolean(sessionId),
  });

  if (isError) {
    return (
      <div className="flex min-w-0 flex-1 items-center justify-center text-sm text-secondary">
        Unable to load this document.
      </div>
    );
  }

  // The shell stays mounted while the session is loading so only the page area
  // fills in, instead of the whole column being torn down and rebuilt.
  return (
    <PdfViewer fileUrl={data?.data?.document_url} title={data?.data?.title} />
  );
};

export default DocumentRenderer;
