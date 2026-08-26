import { getDB } from ".";

const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30일

export async function cacheHymn(
  number: number,
  title: string,
  content: string,
  category: "hymn" | "naeyoung"
): Promise<void> {
  const db = await getDB();
  const id = `${category}-${number}`;

  const tx = db.transaction("hymn", "readwrite");
  await tx.objectStore("hymn").put({
    id,
    number,
    title,
    content,
    category,
    cachedAt: Date.now(),
  });
  await tx.done;
}

export async function getCachedHymn(
  number: number,
  category: "hymn" | "naeyoung"
): Promise<{ title: string; content: string } | null> {
  const db = await getDB();
  const id = `${category}-${number}`;

  const tx = db.transaction("hymn", "readonly");
  const record = await tx.objectStore("hymn").get(id);

  if (!record) return null;

  const age = Date.now() - record.cachedAt;
  if (age > CACHE_TTL_MS) {
    await deleteCachedHymn(number, category);
    return null;
  }

  return { title: record.title, content: record.content };
}

export async function deleteCachedHymn(
  number: number,
  category: "hymn" | "naeyoung"
): Promise<void> {
  const db = await getDB();
  const id = `${category}-${number}`;

  const tx = db.transaction("hymn", "readwrite");
  await tx.objectStore("hymn").delete(id);
  await tx.done;
}
