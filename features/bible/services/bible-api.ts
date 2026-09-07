export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleChapter {
  book: string;
  chapter: number;
  version: "KOREAN" | "KJV";
  verses: BibleVerse[];
}

// 한국어 성경 API (개역개정)
const KOREAN_API_BASE = "https://bible-api.com";
// 영어 성경 API (KJV)
const ENGLISH_API_BASE = "https://bible-api.com";

export async function fetchBibleChapter(
  book: string,
  chapter: number,
  translation: "kyo" | "kjv" = "kyo"
): Promise<BibleChapter> {
  const apiBase = translation === "kyo" ? KOREAN_API_BASE : ENGLISH_API_BASE;

  const response = await fetch(
    `${apiBase}/${book}+${chapter}?translation=${translation}&include_verse_numbers=true`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Bible chapter: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    book: data.reference.book || book,
    chapter: data.reference.chapter || chapter,
    version: translation === "kyo" ? "KOREAN" : "KJV",
    verses: data.verses.map((v: BibleVerse) => ({
      book: data.reference.book || book,
      chapter: data.reference.chapter || chapter,
      verse: v.verse,
      text: v.text.trim(),
    })),
  };
}

export async function fetchBibleVerse(
  book: string,
  chapter: number,
  verse: number,
  translation: "kyo" | "kjv" = "kyo"
): Promise<BibleVerse> {
  const apiBase = translation === "kyo" ? KOREAN_API_BASE : ENGLISH_API_BASE;
  const response = await fetch(
    `${apiBase}/${book}+${chapter}:${verse}?translation=${translation}&include_verse_numbers=true`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Bible verse: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    book: data.reference.book || book,
    chapter: data.reference.chapter || chapter,
    verse: data.verse || verse,
    text: data.text.trim(),
  };
}
