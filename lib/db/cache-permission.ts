import { getDB } from ".";

const CACHE_PERMISSION_KEY = "cache_permission_granted";

export async function requestCachePermission(): Promise<boolean> {
  const db = await getDB();
  const tx = db.transaction("settings", "readonly");
  const stored = await tx.objectStore("settings").get(CACHE_PERMISSION_KEY);

  if (stored?.value) {
    return true;
  }

  return false;
}

export async function grantCachePermission(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction("settings", "readwrite");
  await tx.objectStore("settings").put({
    key: CACHE_PERMISSION_KEY,
    value: true,
    updatedAt: Date.now(),
  });
  await tx.done;
}

export async function revokeCachePermission(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction("settings", "readwrite");
  await tx.objectStore("settings").delete(CACHE_PERMISSION_KEY);
  await tx.done;
}
