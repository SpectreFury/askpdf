'use client';

import { Document, Page, pdfjs } from "react-pdf";
import type { DocumentProps } from "react-pdf";

// 1. Configure the worker (Required for parsing the PDF)
// Served from /public (copied from node_modules by scripts/copy-pdf-worker.mjs on install)
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// Optional: Import text layer and annotation styles if you want selectable text
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

// Width the page is rendered at 100% zoom. Pinning a width (instead of letting
// the page fill its column) is what keeps the aspect ratio intact.
const PAGE_WIDTH = 720;
const ZOOM_STEP = 25;
const MIN_ZOOM = 50;
const MAX_ZOOM = 200;

// US Letter, used to reserve the page box before the real size is known so the
// first paint does not collapse to zero height and reflow once the canvas lands.
const DEFAULT_ASPECT_RATIO = 792 / 612;

type DocumentCallback = Parameters<
  NonNullable<DocumentProps["onLoadSuccess"]>
>[0];

type PdfViewerProps = {
  fileUrl?: string;
  title?: string;
};

const PdfViewer = ({ fileUrl, title }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [zoom, setZoom] = useState(100);
  const [aspectRatio, setAspectRatio] = useState(DEFAULT_ASPECT_RATIO);

  const scrollRef = useRef<HTMLDivElement>(null);

  const pageWidth = Math.round((PAGE_WIDTH * zoom) / 100);
  const reservedHeight = Math.round(pageWidth * aspectRatio);

  // Each page replaces the last, so start from the top instead of keeping the
  // scroll offset of the previous one.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [pageNumber]);

  function goToPage(page: number) {
    const lastPage = numPages || 1;
    const next = Math.min(Math.max(1, Math.round(page)), lastPage);

    setPageNumber(next);
    setPageInput(String(next));
  }

  async function onDocumentLoadSuccess(pdf: DocumentCallback) {
    setNumPages(pdf.numPages);
    goToPage(1);

    try {
      const firstPage = await pdf.getPage(1);
      const [, , right, top] = firstPage.view;

      setAspectRatio(top / right);
    } catch {
      // Keep the default ratio; the page still renders at its own size.
    }
  }

  function commitPageInput() {
    const parsed = Number.parseInt(pageInput, 10);

    if (Number.isNaN(parsed)) {
      setPageInput(String(pageNumber));
      return;
    }

    goToPage(parsed);
  }

  function changeZoom(delta: number) {
    setZoom((current) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current + delta)));
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-muted/30">
      <div className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
        <div className="flex min-w-0 items-center gap-2">
          <FileText className="size-4 shrink-0 text-secondary" />
          <span className="truncate text-sm font-medium">{title}</span>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => goToPage(pageNumber - 1)}
            disabled={pageNumber <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft />
          </Button>

          <div className="flex items-center gap-1.5 text-sm text-secondary">
            <Input
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={commitPageInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
              aria-label="Page number"
              className="h-7 w-11 text-center tabular-nums"
            />
            of {numPages}
          </div>

          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => goToPage(pageNumber + 1)}
            disabled={numPages > 0 && pageNumber >= numPages}
            aria-label="Next page"
          >
            <ChevronRight />
          </Button>

          <div className="ml-2 flex items-center gap-1 border-l pl-3">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => changeZoom(-ZOOM_STEP)}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Zoom out"
            >
              <ZoomOut />
            </Button>

            <span className="w-12 text-center text-sm tabular-nums text-secondary">
              {zoom}%
            </span>

            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => changeZoom(ZOOM_STEP)}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Zoom in"
            >
              <ZoomIn />
            </Button>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-auto p-6">
        {/* minHeight reserves the page box before the canvas exists, so the
            swap from skeleton to rendered page does not move the layout */}
        <div
          className="mx-auto w-fit"
          style={{ width: pageWidth, minHeight: reservedHeight }}
        >
          {fileUrl ? (
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div
                  className="animate-pulse rounded-sm border border-border bg-card"
                  style={{ height: reservedHeight }}
                />
              }
              error={
                <div
                  className="grid place-items-center rounded-sm border border-border bg-card text-sm text-secondary"
                  style={{ height: reservedHeight }}
                >
                  Unable to render this document.
                </div>
              }
            >
              <Page
                pageNumber={pageNumber}
                width={pageWidth}
                className="rounded-sm border border-border shadow-sm"
                loading={<div className="h-full w-full bg-card" />}
              />
            </Document>
          ) : (
            <div
              className="animate-pulse rounded-sm border border-border bg-card"
              style={{ height: reservedHeight }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
