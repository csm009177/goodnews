"use client";

import { SheetMusic } from "../services/sheet-data";

interface SheetListProps {
  sheets: SheetMusic[];
  onSelect: (sheet: SheetMusic) => void;
}

export default function SheetList({ sheets, onSelect }: SheetListProps) {
  if (sheets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-sm">악보가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sheets.map((sheet) => (
        <button
          key={sheet.id}
          onClick={() => onSelect(sheet)}
          className="backlight-hover text-left bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 transition-all"
        >
          {/* 썸네일 영역 */}
          <div className="h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>

          {/* 정보 영역 */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {sheet.title}
            </h3>
            {sheet.composer && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {sheet.composer}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-medium">
                {sheet.category}
              </span>
              {sheet.pageCount && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {sheet.pageCount}페이지
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
