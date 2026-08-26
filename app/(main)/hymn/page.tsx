"use client";

import { useHymnSearch } from "@/features/hymn/hooks/useHymnSearch";
import HymnSearchBar from "@/features/hymn/components/HymnSearchBar";
import HymnList from "@/features/hymn/components/HymnList";
import HymnDetail from "@/features/hymn/components/HymnDetail";

export default function HymnPage() {
  const {
    query,
    setQuery,
    searchMode,
    setSearchMode,
    results,
    selectedHymn,
    loading,
    selectHymn,
    clearSelection,
  } = useHymnSearch();

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* 상단 검색 바 */}
      <div className="sticky top-14 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <HymnSearchBar
            query={query}
            onQueryChange={setQuery}
            searchMode={searchMode}
            onSearchModeChange={setSearchMode}
            resultCount={results.length}
          />
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-4">
        {selectedHymn ? (
          /* 선택된 찬송가 상세 */
          <HymnDetail hymn={selectedHymn} onClose={clearSelection} />
        ) : (
          /* 찬송가 목록 */
          <HymnList hymns={results} loading={loading} onSelect={selectHymn} />
        )}
      </div>
    </div>
  );
}
