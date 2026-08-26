"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { SheetMusic } from "../services/sheet-data";
import { getCachedBinary, cacheBinaryFromUrl } from "@/lib/db/binary-cache";

// pdfjs-dist worker 설정
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export function useSheetViewer(sheet: SheetMusic | null) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renderScale, setRenderScale] = useState(1.5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);

  const loadPDF = useCallback(
    async (url: string) => {
      setLoading(true);
      setError(null);

      try {
        // 캐시 확인
        const cached = await getCachedBinary("sheet", url);
        let pdfData: ArrayBuffer | null = cached?.data ?? null;

        // 캐시가 없으면 다운로드
        if (!pdfData) {
          const response = await fetch(url);
          if (!response.ok) throw new Error("Failed to load PDF");
          pdfData = await response.arrayBuffer();

          // 백그라운드 캐싱
          cacheBinaryFromUrl("sheet", url, "application/pdf");
        }

        const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;
        pdfDocRef.current = pdfDoc;
        setTotalPages(pdfDoc.numPages);
        setCurrentPage(1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load PDF");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const renderPage = useCallback(
    async (pageNum: number) => {
      if (!pdfDocRef.current || !canvasRef.current) return;

      try {
        const page = await pdfDocRef.current.getPage(pageNum);
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        const viewport = page.getViewport({ scale: renderScale });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to render page");
      }
    },
    [renderScale]
  );

  useEffect(() => {
    if (sheet?.url) {
      loadPDF(sheet.url);
    }
  }, [sheet, loadPDF]);

  useEffect(() => {
    if (totalPages > 0) {
      renderPage(currentPage);
    }
  }, [currentPage, totalPages, renderPage]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, totalPages]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  const zoomIn = useCallback(() => {
    setRenderScale((prev) => Math.min(prev + 0.5, 4));
  }, []);

  const zoomOut = useCallback(() => {
    setRenderScale((prev) => Math.max(prev - 0.5, 0.5));
  }, []);

  return {
    canvasRef,
    currentPage,
    totalPages,
    loading,
    error,
    renderScale,
    goToNextPage,
    goToPrevPage,
    zoomIn,
    zoomOut,
  };
}
