import { openDB, DBSchema, IDBPDatabase } from "idb";

const DB_NAME = "goodnews-db";
const DB_VERSION = 1;

export interface GoodnewsDB extends DBSchema {
  bible: {
    key: string;
    value: {
      book: string;
      chapter: number;
      content: string;
      version: "KOREAN" | "KJV";
      cachedAt: number;
    };
    indexes: { "book-chapter-version": [string, number, string] };
  };
  hymn: {
    key: string;
    value: {
      id: string;
      number: number;
      title: string;
      content: string;
      category: "hymn" | "naeyoung";
      cachedAt: number;
    };
    indexes: { "number-category": [number, string] };
  };
  sheet: {
    key: string;
    value: {
      url: string;
      data: ArrayBuffer;
      mimeType: string;
      cachedAt: number;
      expiresAt: number;
    };
  };
  audio: {
    key: string;
    value: {
      url: string;
      data: ArrayBuffer;
      mimeType: string;
      cachedAt: number;
      expiresAt: number;
    };
  };
  settings: {
    key: string;
    value: {
      key: string;
      value: unknown;
      updatedAt: number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<GoodnewsDB>> | null = null;

export async function getDB(): Promise<IDBPDatabase<GoodnewsDB>> {
  if (!dbPromise) {
    dbPromise = openDB<GoodnewsDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // 성경 캐시
        if (!db.objectStoreNames.contains("bible")) {
          const bibleStore = db.createObjectStore("bible", {
            keyPath: "id",
          });
          bibleStore.createIndex(
            "book-chapter-version",
            ["book", "chapter", "version"]
          );
        }

        // 찬송가 캐시
        if (!db.objectStoreNames.contains("hymn")) {
          const hymnStore = db.createObjectStore("hymn", {
            keyPath: "id",
          });
          hymnStore.createIndex("number-category", ["number", "category"]);
        }

        // 악보 캐시
        if (!db.objectStoreNames.contains("sheet")) {
          db.createObjectStore("sheet", { keyPath: "url" });
        }

        // 오디오 캐시
        if (!db.objectStoreNames.contains("audio")) {
          db.createObjectStore("audio", { keyPath: "url" });
        }

        // 설정 저장
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "key" });
        }
      },
    });
  }

  return dbPromise;
}
