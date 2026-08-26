import { getDB } from ".";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24시간

export async function cacheBinary(
  store: "sheet" | "audio",
  url: string,
  data: ArrayBuffer,
  mimeType: string
): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(store, "readwrite");
  await tx.objectStore(store).put({
    url,
    data,
    mimeType,
    cachedAt: Date.now(),
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
  await tx.done;
}

export async function getCachedBinary(
  store: "sheet" | "audio",
  url: string
): Promise<{ data: ArrayBuffer; mimeType: string } | null> {
  const db = await getDB();
  const tx = db.transaction(store, "readonly");
  const record = await tx.objectStore(store).get(url);

  if (!record) return null;

  if (Date.now() > record.expiresAt) {
    await deleteCachedBinary(store, url);
    return null;
  }

  return { data: record.data, mimeType: record.mimeType };
}

export async function deleteCachedBinary(
  store: "sheet" | "audio",
  url: string
): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(store, "readwrite");
  await tx.objectStore(store).delete(url);
  await tx.done;
}

export async function cacheBinaryFromUrl(
  store: "sheet" | "audio",
  url: string,
  mimeType?: string
): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) return;

    const data = await response.arrayBuffer();
    const detectedType = mimeType || response.headers.get("content-type") || "application/octet-stream";

    await cacheBinary(store, url, data, detectedType);
  } catch {
    // 백그라운드 캐싱 실패는 무시
  }
}
