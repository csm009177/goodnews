"use client";

import { BibleChapter } from "../services/bible-api";
import { BibleViewMode } from "../hooks/useBible";

interface BibleViewerProps {
  koreanChapter: BibleChapter | null;
  kjvChapter: BibleChapter | null;
  viewMode: BibleViewMode;
  loading: boolean;
  error: string | null;
  onNext: () => void;
  onPrev: () => void;
  bookName: string;
  chapter: number;
}

export default function BibleViewer({
  koreanChapter,
  kjvChapter,
  viewMode,
  loading,
  error,
  onNext,
  onPrev,
  bookName,
  chapter,
}: BibleViewerProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500">
        <p className="text-lg font-medium mb-2">로딩 실패</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 장 제목 */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {bookName} {chapter}
        </h2>
      </div>

      {/* 성경 본문 */}
      <div className="space-y-6">
        {viewMode === "KOREAN" && koreanChapter && (
          <BibleText chapter={koreanChapter} lang="ko" />
        )}

        {viewMode === "KJV" && kjvChapter && (
          <BibleText chapter={kjvChapter} lang="en" />
        )}

        {viewMode === "BOTH" && koreanChapter && kjvChapter && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                개역한글
              </h3>
              <BibleText chapter={koreanChapter} lang="ko" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                KJV
              </h3>
              <BibleText chapter={kjvChapter} lang="en" />
            </div>
          </div>
        )}
      </div>

      {/* 이전/다음 장 네비게이션 */}
      <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onPrev}
          className="backlight-hover px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300"
        >
          ← 이전 장
        </button>
        <button
          onClick={onNext}
          className="backlight-hover px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300"
        >
          다음 장 →
        </button>
      </div>
    </div>
  );
}

function BibleText({
  chapter,
  lang,
}: {
  chapter: BibleChapter;
  lang: "ko" | "en";
}) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      {chapter.verses.map((verse) => (
        <span
          key={verse.verse}
          className="inline"
        >
          <sup className="text-xs text-blue-600 dark:text-blue-400 font-medium mr-0.5">
            {verse.verse}
          </sup>
          {verse.text}{" "}
        </span>
      ))}
    </div>
  );
}
