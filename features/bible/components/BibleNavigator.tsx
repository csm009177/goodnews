"use client";

import { useState } from "react";
import { BIBLE_BOOKS_KOREAN, BIBLE_BOOKS_ENGLISH, TOTAL_BOOKS } from "@/lib/utils/bible-books";

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

  const handleNavigate = () => {
    onNavigate(selectedBook, selectedChapter);
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
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              책 선택
            </h3>
            <div className="grid grid-cols-3 gap-1 max-h-48 overflow-y-auto mb-3">
              {Array.from({ length: TOTAL_BOOKS }, (_, i) => i + 1).map((bookNum) => (
                <button
                  key={bookNum}
                  onClick={() => setSelectedBook(bookNum)}
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
              장 선택
            </h3>
            <div className="grid grid-cols-5 gap-1 max-h-32 overflow-y-auto mb-3">
              {Array.from({ length: 50 }, (_, i) => i + 1).map((chapNum) => (
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
        </div>
      )}
    </div>
  );
}
