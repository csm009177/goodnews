"use client";

import { useState, useRef, useEffect } from "react";
import { Hymn } from "../services/hymn-data";

interface HymnSearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  searchMode: "ALL" | "HYMN" | "NAEYOUNG";
  onSearchModeChange: (mode: "ALL" | "HYMN" | "NAEYOUNG") => void;
  resultCount: number;
}

export default function HymnSearchBar({
  query,
  onQueryChange,
  searchMode,
  onSearchModeChange,
  resultCount,
}: HymnSearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const modes: { label: string; value: "ALL" | "HYMN" | "NAEYOUNG" }[] = [
    { label: "통합", value: "ALL" },
    { label: "찬송가", value: "HYMN" },
    { label: "내영의노래", value: "NAEYOUNG" },
  ];

  return (
    <div className="space-y-3">
      {/* 검색 모드 토글 */}
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {modes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => onSearchModeChange(mode.value)}
            className={`backlight-hover flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              searchMode === mode.value
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* 검색 입력 */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="찬송가 번호, 제목, 가사로 검색..."
          className="w-full px-4 py-3 pl-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {query && (
          <button
            onClick={() => onQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 backlight-hover w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* 결과 수 */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {query ? `${resultCount}개 결과` : "검색어를 입력하세요"}
      </div>
    </div>
  );
}
