"use client";

import { Hymn } from "../services/hymn-data";

interface HymnListProps {
  hymns: Hymn[];
  loading: boolean;
  onSelect: (hymn: Hymn) => void;
}

export default function HymnList({ hymns, loading, onSelect }: HymnListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400" />
      </div>
    );
  }

  if (hymns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
        <p className="text-sm">검색 결과가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {hymns.map((hymn) => (
        <button
          key={`${hymn.category}-${hymn.number}`}
          onClick={() => onSelect(hymn)}
          className="backlight-hover w-full text-left px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-all"
        >
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-bold">
              {hymn.number}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {hymn.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {hymn.category === "hymn" ? "찬송가" : "내영의노래"}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
