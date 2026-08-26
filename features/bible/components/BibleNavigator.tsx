"use client";

import { useState, useMemo } from "react";
import { BIBLE_BOOKS_KOREAN, BIBLE_BOOKS_ENGLISH, TOTAL_BOOKS, getBookChapterCount } from "@/lib/utils/bible-books";

interface BibleNavigatorProps {
  currentBook: number;
  currentChapter: number;
  onNavigate: (book: number, chapter: number) => void;
}

export default function BibleNavigator({
  currentBook,
  currentChapter,
  onNavigate,
}: BibleNavigatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(currentBook);
  const [selectedChapter, setSelectedChapter] = useState(currentChapter);
  const [searchMode, setSearchMode] = useState(false);
  const [searchBook, setSearchBook] = useState(1);
  const [searchChapter, setSearchChapter] = useState(1);
  const [searchVerse, setSearchVerse] = useState(1);

  // 현재 선택된 책의 장 수
  const maxChapters = useMemo(() => getBookChapterCount(selectedBook), [selectedBook]);
  const searchMaxChapters = useMemo(() => getBookChapterCount(searchBook), [searchBook]);

  const handleNavigate = () => {
    onNavigate(selectedBook, selectedChapter);
    setIsOpen(false);
  };

  const handleSearchNavigate = () => {
    onNavigate(searchBook, searchChapter);
    setSearchMode(false);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="backlight-hover px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300"
      >
        {BIBLE_BOOKS_KOREAN[currentBook]} {currentChapter}장
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-40 overflow-hidden">
          {/* 탭 전환 */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setSearchMode(false)}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                !searchMode
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              책/장 이동
            </button>
            <button
              onClick={() => setSearchMode(true)}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                searchMode
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              구절 찾기
            </button>
          </div>

          {!searchMode ? (
            /* 책/장 이동 모드 */
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                책 선택
              </h3>
              <div className="grid grid-cols-3 gap-1 max-h-48 overflow-y-auto mb-3">
                {Array.from({ length: TOTAL_BOOKS }, (_, i) => i + 1).map((bookNum) => (
                  <button
                    key={bookNum}
                    onClick={() => {
                      setSelectedBook(bookNum);
                      setSelectedChapter(1);
                    }}
                    className={`backlight-hover px-2 py-1.5 rounded text-xs text-center ${
                      selectedBook === bookNum
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {BIBLE_BOOKS_KOREAN[bookNum]}
                  </button>
                ))}
              </div>

              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                장 선택 (1-{maxChapters})
              </h3>
              <div className="grid grid-cols-5 gap-1 max-h-32 overflow-y-auto mb-3">
                {Array.from({ length: maxChapters }, (_, i) => i + 1).map((chapNum) => (
                  <button
                    key={chapNum}
                    onClick={() => setSelectedChapter(chapNum)}
                    className={`backlight-hover px-2 py-1.5 rounded text-xs text-center ${
                      selectedChapter === chapNum
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {chapNum}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNavigate}
                className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-500 dark:hover:bg-blue-400"
              >
                이동
              </button>
            </div>
          ) : (
            /* 구절 찾기 모드 */
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  책
                </label>
                <select
                  value={searchBook}
                  onChange={(e) => {
                    setSearchBook(Number(e.target.value));
                    setSearchChapter(1);
                    setSearchVerse(1);
                  }}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                >
                  {Array.from({ length: TOTAL_BOOKS }, (_, i) => i + 1).map((bookNum) => (
                    <option key={bookNum} value={bookNum}>
                      {BIBLE_BOOKS_KOREAN[bookNum]} ({BIBLE_BOOKS_ENGLISH[bookNum]})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    장
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={searchMaxChapters}
                    value={searchChapter}
                    onChange={(e) => setSearchChapter(Math.max(1, Math.min(searchMaxChapters, Number(e.target.value))))}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    절
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={searchVerse}
                    onChange={(e) => setSearchVerse(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                  />
                </div>
              </div>

              <button
                onClick={handleSearchNavigate}
                className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-500 dark:hover:bg-blue-400"
              >
                {BIBLE_BOOKS_KOREAN[searchBook]} {searchChapter}장 {searchVerse}절로 이동
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
