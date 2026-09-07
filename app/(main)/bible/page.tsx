"use client";

import { useBible } from "@/features/bible/hooks/useBible";
import BibleViewer from "@/features/bible/components/BibleViewer";
import BibleViewModeToggle from "@/features/bible/components/BibleViewModeToggle";
import BibleNavigator from "@/features/bible/components/BibleNavigator";
import { BIBLE_BOOKS_KOREAN } from "@/lib/utils/bible-books";
import { useEffect, useRef } from "react";

export default function BiblePage() {
  const {
    koreanChapter,
    kjvChapter,
    loading,
    error,
    viewMode,
    setViewMode,
    currentBook,
    currentChapter,
    goToNextChapter,
    goToPrevChapter,
    scrollToVerse,
  } = useBible(1, 1);

  // 구절 스크롤 효과
  const pendingVerse = useRef<number | null>(null);

  useEffect(() => {
    if (pendingVerse.current && scrollToVerse.current) {
      // 데이터 로딩 후 구절로 스크롤
      setTimeout(() => {
        scrollToVerse.current!(pendingVerse.current!);
        pendingVerse.current = null;
      }, 300);
    }
  }, [currentBook, currentChapter, scrollToVerse]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* 상단 컨트롤 바 */}
      <div className="sticky top-14 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <BibleNavigator
            currentBook={currentBook}
            currentChapter={currentChapter}
            onNavigate={(book, chapter, verse) => {
              // useBible의 상태 업데이트를 위해 별도 처리 필요
              // 현재는 네비게이터 내부에서 처리
              if (verse) {
                pendingVerse.current = verse;
              }
            }}
          />
          <BibleViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>
      </div>

      {/* 성경 본문 */}
      <BibleViewer
        koreanChapter={koreanChapter}
        kjvChapter={kjvChapter}
        viewMode={viewMode}
        loading={loading}
        error={error}
        onNext={goToNextChapter}
        onPrev={goToPrevChapter}
        bookName={BIBLE_BOOKS_KOREAN[currentBook]}
        chapter={currentChapter}
        scrollToVerseRef={scrollToVerse}
      />
    </div>
  );
}
