"use client";

import { useBible } from "@/features/bible/hooks/useBible";
import BibleViewer from "@/features/bible/components/BibleViewer";
import BibleViewModeToggle from "@/features/bible/components/BibleViewModeToggle";
import BibleNavigator from "@/features/bible/components/BibleNavigator";
import { BIBLE_BOOKS_KOREAN } from "@/lib/utils/bible-books";

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
  } = useBible(1, 1);

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* 상단 컨트롤 바 */}
      <div className="sticky top-14 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <BibleNavigator
            currentBook={currentBook}
            currentChapter={currentChapter}
            onNavigate={(book, chapter) => {
              // TODO: 네비게이션 처리
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
      />
    </div>
  );
}
