import { getDB } from ".";

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7일

export async function cacheBibleChapter(
  book: string,
  chapter: number,
  content: string,
  version: "KOREAN" | "KJV"
): Promise<void> {
  const db = await getDB();
  const id = `${book}-${chapter}-${version}`;

  const tx = db.transaction("bible", "readwrite");
  await tx.objectStore("bible").put({
    id,
    book,
    chapter,
    content,
    version,
    cachedAt: Date.now(),
  });
  await tx.done;
}

export async function getCachedBibleChapter(
  book: string,
  chapter: number,
  version: "KOREAN" | "KJV"
): Promise<string | null> {
  const db = await getDB();
  const id = `${book}-${chapter}-${version}`;

  const tx = db.transaction("bible", "readonly");
  const record = await tx.objectStore("bible").get(id);

  if (!record) return null;

  const age = Date.now() - record.cachedAt;
  if (age > CACHE_TTL_MS) {
    await deleteCachedBibleChapter(book, chapter, version);
    return null;
  }

  return record.content;
}

export async function deleteCachedBibleChapter(
  book: string,
  chapter: number,
  version: "KOREAN" | "KJV"
): Promise<void> {
  const db = await getDB();
  const id = `${book}-${chapter}-${version}`;

  const tx = db.transaction("bible", "readwrite");
  await tx.objectStore("bible").delete(id);
  await tx.done;
}
