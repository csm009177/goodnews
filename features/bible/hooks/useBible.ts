"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { BibleChapter } from "../services/bible-api";
import { fetchBibleChapter } from "../services/bible-api";
import { getCachedBibleChapter, cacheBibleChapter } from "@/lib/db/bible-cache";
import { BIBLE_BOOKS_KOREAN, BIBLE_BOOKS_ENGLISH, TOTAL_BOOKS, getBookChapterCount } from "@/lib/utils/bible-books";

export type BibleViewMode = "KOREAN" | "KJV" | "BOTH";

interface ChapterCache {
  korean: BibleChapter | null;
  kjv: BibleChapter | null;
}

export function useBible(book: number, chapter: number) {
  const [koreanChapter, setKoreanChapter] = useState<BibleChapter | null>(null);
  const [kjvChapter, setKjvChapter] = useState<BibleChapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<BibleViewMode>("KOREAN");
  const [currentBook, setCurrentBook] = useState(book);
  const [currentChapter, setCurrentChapter] = useState(chapter);

  // 3장 슬라이딩 윈도우 캐시 (이전/현재/다음 장)
  const chapterCache = useRef<Map<string, ChapterCache>>(new Map());

  const getCacheKey = (bookNum: number, chapterNum: number) => `${bookNum}-${chapterNum}`;

  const loadChapter = useCallback(
    async (bookNum: number, chapterNum: number, version: "KOREAN" | "KJV") => {
      const bookName =
        version === "KOREAN"
          ? BIBLE_BOOKS_KOREAN[bookNum]
          : BIBLE_BOOKS_ENGLISH[bookNum];
      const translation = version === "KOREAN" ? "kyo" : "kjv";

      // 캐시 확인
      const cached = await getCachedBibleChapter(bookName, chapterNum, version);
      if (cached) {
        try {
          const verses = JSON.parse(cached);
          const parsed: BibleChapter = {
            book: bookName,
            chapter: chapterNum,
            version,
            verses,
          };
          const cacheKey = getCacheKey(bookNum, chapterNum);
          const existing = chapterCache.current.get(cacheKey) || { korean: null, kjv: null };
          const updated = version === "KOREAN" ? { ...existing, korean: parsed } : { ...existing, kjv: parsed };
          chapterCache.current.set(cacheKey, updated);
          return;
        } catch {
          // 캐시 파싱 실패 시 무시하고 API 호출
        }
      }

      try {
        const data = await fetchBibleChapter(bookName, chapterNum, translation);

        // 캐시 저장
        const content = JSON.stringify(data.verses);
        await cacheBibleChapter(bookName, chapterNum, content, version);

        // 인메모리 캐시에도 저장
        const cacheKey = getCacheKey(bookNum, chapterNum);
        const existing = chapterCache.current.get(cacheKey) || { korean: null, kjv: null };
        const updated = version === "KOREAN" ? { ...existing, korean: data } : { ...existing, kjv: data };
        chapterCache.current.set(cacheKey, updated);
      } catch (err) {
        throw err;
      }
    },
    []
  );

  // 이전/다음 장 이동 함수 (스와이프에서 먼저 참조)
  const goToNextChapter = useCallback(() => {
    let nextChapter = currentChapter + 1;
    let nextBook = currentBook;
    const maxChapters = getBookChapterCount(currentBook);

    if (nextChapter > maxChapters) {
      if (nextBook < TOTAL_BOOKS) {
        nextBook++;
        nextChapter = 1;
      } else {
        return;
      }
    }

    setCurrentBook(nextBook);
    setCurrentChapter(nextChapter);
  }, [currentBook, currentChapter]);

  const goToPrevChapter = useCallback(() => {
    let prevChapter = currentChapter - 1;
    let prevBook = currentBook;

    if (prevChapter < 1) {
      if (prevBook > 1) {
        prevBook--;
        prevChapter = getBookChapterCount(prevBook);
      } else {
        return;
      }
    }

    setCurrentBook(prevBook);
    setCurrentChapter(prevChapter);
  }, [currentBook, currentChapter]);

  // 3장 윈도우 로딩 (이전/현재/다음 장)
  const loadSlidingWindow = useCallback(async () => {
    const cacheKey = getCacheKey(currentBook, currentChapter);
    const cached = chapterCache.current.get(cacheKey);

    // 현재 장이 캐시에 있으면 즉시 표시
    if (cached) {
      if (viewMode === "KOREAN" || viewMode === "BOTH") {
        if (cached.korean) setKoreanChapter(cached.korean);
      }
      if (viewMode === "KJV" || viewMode === "BOTH") {
        if (cached.kjv) setKjvChapter(cached.kjv);
      }
    }

    const wasLoading = loading;
    if (!cached?.korean || !cached?.kjv) {
      setLoading(true);
    }
    setError(null);

    // 이전/현재/다음 장 계산
    const chaptersToLoad: { book: number; chapter: number }[] = [];

    // 이전 장
    let prevChapter = currentChapter - 1;
    let prevBook = currentBook;
    if (prevChapter < 1) {
      if (prevBook > 1) {
        prevBook--;
        prevChapter = getBookChapterCount(prevBook);
      }
    }
    if (prevChapter >= 1) {
      chaptersToLoad.push({ book: prevBook, chapter: prevChapter });
    }

    // 현재 장
    chaptersToLoad.push({ book: currentBook, chapter: currentChapter });

    // 다음 장
    let nextChapter = currentChapter + 1;
    let nextBook = currentBook;
    const maxChapters = getBookChapterCount(currentBook);
    if (nextChapter > maxChapters) {
      if (nextBook < TOTAL_BOOKS) {
        nextBook++;
        nextChapter = 1;
      }
    }
    if (nextChapter >= 1) {
      chaptersToLoad.push({ book: nextBook, chapter: nextChapter });
    }

    // 병렬 로딩
    const loadPromises: Promise<unknown>[] = [];

    for (const { book: b, chapter: c } of chaptersToLoad) {
      if (viewMode === "KOREAN" || viewMode === "BOTH") {
        loadPromises.push(loadChapter(b, c, "KOREAN").catch(() => {}));
      }
      if (viewMode === "KJV" || viewMode === "BOTH") {
        loadPromises.push(loadChapter(b, c, "KJV").catch(() => {}));
      }
    }

    await Promise.all(loadPromises);

    // 현재 장 데이터 설정
    const finalCache = chapterCache.current.get(cacheKey);
    if (finalCache) {
      if (viewMode === "KOREAN" || viewMode === "BOTH") {
        setKoreanChapter(finalCache.korean);
      }
      if (viewMode === "KJV" || viewMode === "BOTH") {
        setKjvChapter(finalCache.kjv);
      }
    }

    if (!wasLoading) {
      setLoading(false);
    }
  }, [currentBook, currentChapter, viewMode, loadChapter, loading]);

  useEffect(() => {
    loadSlidingWindow();
  }, [loadSlidingWindow]);

  // 스와이프 감지
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const navigateRef = useRef({ goToNextChapter, goToPrevChapter });

  useEffect(() => {
    navigateRef.current = { goToNextChapter, goToPrevChapter };
  }, [goToNextChapter, goToPrevChapter]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // 수평 스와이프인지 확인 (수직 이동보다 수평 이동이 더 커야 함)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 100) {
      if (deltaX > 0) {
        // 우→좌: 다음 장
        navigateRef.current.goToNextChapter();
      } else {
        // 좌→우: 이전 장
        navigateRef.current.goToPrevChapter();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  }, []);

  useEffect(() => {
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  // 구절로 스크롤 (구절 찾기 시 사용)
  const scrollToVerse = useRef<(verseNum: number) => void>(() => {});

  return {
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
  };
}
