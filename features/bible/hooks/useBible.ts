"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { BibleChapter } from "../services/bible-api";
import { fetchBibleChapter } from "../services/bible-api";
import { getCachedBibleChapter, cacheBibleChapter } from "@/lib/db/bible-cache";
import { BIBLE_BOOKS_KOREAN, BIBLE_BOOKS_ENGLISH, TOTAL_BOOKS } from "@/lib/utils/bible-books";

export type BibleViewMode = "KOREAN" | "KJV" | "BOTH";

export function useBible(book: number, chapter: number) {
  const [koreanChapter, setKoreanChapter] = useState<BibleChapter | null>(null);
  const [kjvChapter, setKjvChapter] = useState<BibleChapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<BibleViewMode>("KOREAN");
  const [currentBook, setCurrentBook] = useState(book);
  const [currentChapter, setCurrentChapter] = useState(chapter);

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
        // TODO: 캐시된 데이터를 파싱하여 BibleChapter 형태로 설정
        // setKoreanChapter / setKjvChapter
      }

      try {
        const data = await fetchBibleChapter(bookName, chapterNum, translation);

        if (version === "KOREAN") {
          setKoreanChapter(data);
        } else {
          setKjvChapter(data);
        }

        // 캐시 저장
        const content = JSON.stringify(data.verses);
        await cacheBibleChapter(bookName, chapterNum, content, version);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load chapter");
      }
    },
    []
  );

  useEffect(() => {
    setLoading(true);
    setError(null);

    const loadVersions = async () => {
      if (viewMode === "KOREAN" || viewMode === "BOTH") {
        await loadChapter(currentBook, currentChapter, "KOREAN");
      }
      if (viewMode === "KJV" || viewMode === "BOTH") {
        await loadChapter(currentBook, currentChapter, "KJV");
      }
      setLoading(false);
    };

    loadVersions();
  }, [currentBook, currentChapter, viewMode, loadChapter]);

  const goToNextChapter = useCallback(() => {
    let nextChapter = currentChapter + 1;
    let nextBook = currentBook;

    // 다음 장이 존재하는지 확인 (간단한 체크)
    const maxChapters = [31, 25, 27, 36, 34, 24, 21, 4, 31, 24, 22, 25, 29, 36, 10, 13, 10, 42, 150, 31, 12, 8, 66, 52, 36, 48, 12, 14, 3, 2, 1, 4, 7, 1, 14, 2, 1, 1, 55, 16, 16, 28, 21, 16, 12, 8, 6, 4, 3, 1, 13, 5, 3, 2, 1, 1, 1, 1, 22];

    if (nextChapter > maxChapters[currentBook - 1]) {
      if (nextBook < TOTAL_BOOKS) {
        nextBook++;
        nextChapter = 1;
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
        prevChapter = 31; // TODO: 각 책의 마지막 장으로 정확히 설정
      }
    }

    setCurrentBook(prevBook);
    setCurrentChapter(prevChapter);
  }, [currentBook, currentChapter]);

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
  };
}
