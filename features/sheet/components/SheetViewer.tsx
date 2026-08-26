"use client";

import { useRef } from "react";

interface SheetViewerProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  renderScale: number;
  onNext: () => void;
  onPrev: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export default function SheetViewer({
  canvasRef,
  currentPage,
  totalPages,
  loading,
  error,
  renderScale,
  onNext,
  onPrev,
  onZoomIn,
  onZoomOut,
}: SheetViewerProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
          <p className="text-sm text-gray-400">악보 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-red-400">
        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="text-sm font-medium">로딩 실패</p>
        <p className="text-xs text-gray-400 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full h-full">
      {/* 컨트롤 바 */}
      <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md">
        <button
          onClick={onZoomOut}
          className="backlight-hover w-8 h-8 flex items-center justify-center rounded-lg text-white/80 hover:text-white"
          title="축소"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="text-xs text-white/60 w-12 text-center">
          {Math.round(renderScale * 100)}%
        </span>
        <button
          onClick={onZoomIn}
          className="backlight-hover w-8 h-8 flex items-center justify-center rounded-lg text-white/80 hover:text-white"
          title="확대"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <div className="w-px h-5 bg-white/20 mx-2" />

        <button
          onClick={onPrev}
          disabled={currentPage <= 1}
          className="backlight-hover w-8 h-8 flex items-center justify-center rounded-lg text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-default"
          title="이전 페이지"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-xs text-white/80 w-16 text-center">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={currentPage >= totalPages}
          className="backlight-hover w-8 h-8 flex items-center justify-center rounded-lg text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-default"
          title="다음 페이지"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 캔버스 */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        <canvas
          ref={canvasRef}
          className="shadow-2xl max-w-full"
          style={{ maxWidth: "100%" }}
        />
      </div>
    </div>
  );
}
