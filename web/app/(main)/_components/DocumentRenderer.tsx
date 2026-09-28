'use client';

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { fetchSession } from "../_api/workspace";

// react-pdf pulls in pdfjs-dist/web/pdf_viewer.mjs, which touches `window`/`document`
// at module scope, so it can only ever be imported in the browser.
const PdfViewer = dynamic(() => import("./PdfViewer"), {
  ssr: false,
  loading: () => <PdfViewerSkeleton />,
});

type DocumentRendererProps = {
  sessionId: string;
};

// Same shell as PdfViewer (header + page stage) so the middle column holds its
// full width from first paint. Without this, the dynamic import resolves to
// nothing while loading and the conversation aside slides left against the
// upload bar, then jumps back when the viewer lands.
function PdfViewerSkeleton() {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-muted/30">
      <div className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
        <div className="h-4 w-48 animate-pulse rounded bg-muted" />
        <div className="ml-auto flex shrink-0 items-center gap-1">
          <div className="size-7 animate-pulse rounded border border-border" />
          <div className="h-7 w-11 animate-pulse rounded bg-muted" />
          <div className="size-7 animate-pulse rounded border border-border" />
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-6">
        <div
          className="mx-auto w-full max-w-[720px] animate-pulse rounded-sm border border-border bg-card"
          style={{ height: Math.round(720 * (792 / 612)) }}
        />
      </div>
    </div>
  );
}

const DocumentRenderer = ({ sessionId }: DocumentRendererProps) => {
  const { data, isError } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => fetchSession(sessionId),
    enabled: Boolean(sessionId),
    // The document_url is a signed URL regenerated on every fetch. Refetching
    // mid-session would hand PdfViewer a new string and remount the Document.
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // The wrapper always renders so the middle column keeps its flex-1 width
  // even when the viewer itself renders nothing yet (dynamic import or
  // session still loading). Without it the aside collapses left.
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-muted/30">
      {isError ? (
        <div className="flex flex-1 items-center justify-center text-sm text-secondary">
          Unable to load this document.
        </div>
      ) : (
        // The shell stays mounted while the session is loading so only the
        // page area fills in, instead of the whole column being torn down
        // and rebuilt.
        <PdfViewer
          fileUrl={data?.data?.document_url}
          title={data?.data?.title}
          sessionId={sessionId}
        />
      )}
    </div>
  );
};

export default DocumentRenderer;
