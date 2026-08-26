"use client";

import { useState, useEffect } from "react";
import { SheetMusic, getAllSheets } from "@/features/sheet/services/sheet-data";
import { useSheetViewer } from "@/features/sheet/hooks/useSheetViewer";
import SheetList from "@/features/sheet/components/SheetList";
import SheetViewer from "@/features/sheet/components/SheetViewer";

export default function SheetPage() {
  const [sheets, setSheets] = useState<SheetMusic[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<SheetMusic | null>(null);

  useEffect(() => {
    setSheets(getAllSheets());
  }, []);

  const viewer = useSheetViewer(selectedSheet);

  if (selectedSheet) {
    return (
      <div className="flex flex-col w-full h-full">
        {/* 뒤로가기 버튼 */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => setSelectedSheet(null)}
            className="backlight-hover flex items-center gap-2 px-3 py-2 bg-black/50 backdrop-blur-md rounded-lg text-white/80 hover:text-white text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            목록으로
          </button>
        </div>

        {/* 악보 뷰어 */}
        <SheetViewer {...viewer} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full overflow-auto">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-white">악보</h1>
          <p className="text-sm text-gray-400 mt-1">
            악보를 선택하여 전체화면으로 볼 수 있습니다
          </p>
        </div>
      </div>

      {/* 악보 목록 */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <SheetList sheets={sheets} onSelect={setSelectedSheet} />
      </div>
    </div>
  );
}
