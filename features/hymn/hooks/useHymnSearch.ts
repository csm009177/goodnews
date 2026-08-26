"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Hymn, searchHymns, getAllHymns } from "../services/hymn-data";
import { getCachedHymn, cacheHymn } from "@/lib/db/hymn-cache";

export type HymnSearchMode = "ALL" | "HYMN" | "NAEYOUNG";

export function useHymnSearch() {
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState<HymnSearchMode>("ALL");
  const [results, setResults] = useState<Hymn[]>([]);
  const [selectedHymn, setSelectedHymn] = useState<Hymn | null>(null);
  const [loading, setLoading] = useState(false);

  const categoryMap: Record<HymnSearchMode, "hymn" | "naeyoung" | undefined> = {
    ALL: undefined,
    HYMN: "hymn",
    NAEYOUNG: "naeyoung",
  };

  const performSearch = useCallback(async () => {
    setLoading(true);

    if (query.trim() === "") {
      const all = getAllHymns();
      const filtered = categoryMap[searchMode]
        ? all.filter((h) => h.category === categoryMap[searchMode])
        : all;
      setResults(filtered);
    } else {
      const found = searchHymns(query, categoryMap[searchMode]);
      setResults(found);
    }

    setLoading(false);
  }, [query, searchMode, categoryMap]);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchMode, performSearch]);

  const selectHymn = useCallback(async (hymn: Hymn) => {
    // 캐시 확인
    const cached = await getCachedHymn(hymn.number, hymn.category);
    if (cached) {
      setSelectedHymn({ ...hymn, title: cached.title, content: cached.content });
    } else {
      setSelectedHymn(hymn);
      await cacheHymn(hymn.number, hymn.title, hymn.content, hymn.category);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedHymn(null);
  }, []);

  return {
    query,
    setQuery,
    searchMode,
    setSearchMode,
    results,
    selectedHymn,
    loading,
    selectHymn,
    clearSelection,
  };
}
