"use client"

import { useState, useCallback, useRef } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"
import { PDFToolbar } from "./PDFToolbar"
import { HighlightLayer } from "./HighlightLayer"
import type { HighlightData } from "@/actions/saveHighlight"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface Props {
  pdfUrl: string
  noteId: string
  initialHighlights: HighlightData[]
}

export function PDFViewer({ pdfUrl, noteId, initialHighlights }: Props) {
  const [numPages, setNumPages] = useState(0)
  const [page, setPage]         = useState(1)
  const [scale, setScale]       = useState(1.0)
  const [highlightMode, setHighlightMode] = useState(false)
  const [colour, setColour]     = useState<"yellow" | "green" | "pink">("yellow")
  const pageRef = useRef<HTMLDivElement>(null)

  const onDocumentLoad = useCallback(({ numPages: n }: { numPages: number }) => {
    setNumPages(n)
  }, [])

  function zoomIn()  { setScale((s) => Math.min(3, s + 0.25)) }
  function zoomOut() { setScale((s) => Math.max(0.5, s - 0.25)) }
  function prev()    { setPage((p) => Math.max(1, p - 1)) }
  function next()    { setPage((p) => Math.min(numPages, p + 1)) }

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-96 bg-surface-2 rounded-xl border border-border">
        <p className="text-text-secondary text-sm">PDF not yet available</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <PDFToolbar
        page={page}
        totalPages={numPages}
        scale={scale}
        onPrev={prev}
        onNext={next}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        highlightMode={highlightMode}
        onToggleHighlight={() => setHighlightMode((v) => !v)}
        highlightColour={colour}
        onColourChange={setColour}
      />

      <div className="overflow-auto bg-[#1a1a1e]" style={{ maxHeight: "75vh" }}>
        <div ref={pageRef} className="relative inline-block mx-auto">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoad}
            loading={
              <div className="flex items-center justify-center h-96 w-full">
                <div className="w-6 h-6 rounded-full border-2 border-border border-t-accent animate-spin" />
              </div>
            }
            error={
              <div className="flex items-center justify-center h-96 w-full">
                <p className="text-danger text-sm">Failed to load PDF</p>
              </div>
            }
          >
            <Page
              pageNumber={page}
              scale={scale}
              renderAnnotationLayer={true}
              renderTextLayer={true}
            />
          </Document>
          {numPages > 0 && (
            <HighlightLayer
              noteId={noteId}
              page={page}
              scale={scale}
              isActive={highlightMode}
              colour={colour}
              initialHighlights={initialHighlights.filter((h) => h.page === page)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
