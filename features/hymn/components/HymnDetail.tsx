"use client";

import { Hymn } from "../services/hymn-data";

interface HymnDetailProps {
  hymn: Hymn;
  onClose: () => void;
}

export default function HymnDetail({ hymn, onClose }: HymnDetailProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* 헤더 */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 flex items-center justify-center bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-sm font-bold">
            {hymn.number}
          </span>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {hymn.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {hymn.category === "hymn" ? "찬송가" : "내영의노래"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="backlight-hover w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* 가사 */}
      <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
        <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 dark:text-gray-200 font-sans">
          {hymn.content}
        </pre>
      </div>
    </div>
  );
}
