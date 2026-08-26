export interface SheetMusic {
  id: string;
  title: string;
  composer?: string;
  url: string;
  thumbnailUrl?: string;
  category: string;
  pageCount?: number;
  cachedAt?: number;
}

// TODO: 실제 API 또는 R2에서 악보 목록 가져오기
const DEMO_SHEETS: SheetMusic[] = [
  {
    id: "1",
    title: "합창 악보 1곡",
    composer: "작곡가 A",
    url: "/sheets/sample1.pdf",
    category: "합창",
    pageCount: 5,
  },
  {
    id: "2",
    title: "합창 악보 2곡",
    composer: "작곡가 B",
    url: "/sheets/sample2.pdf",
    category: "합창",
    pageCount: 3,
  },
  {
    id: "3",
    title: "교향곡 악보",
    composer: "작곡가 C",
    url: "/sheets/sample3.pdf",
    category: "교향곡",
    pageCount: 12,
  },
];

export function getAllSheets(): SheetMusic[] {
  return [...DEMO_SHEETS];
}

export function getSheetById(id: string): SheetMusic | undefined {
  return DEMO_SHEETS.find((s) => s.id === id);
}

export function getSheetsByCategory(category: string): SheetMusic[] {
  return DEMO_SHEETS.filter((s) => s.category === category);
}

export function getCategories(): string[] {
  return [...new Set(DEMO_SHEETS.map((s) => s.category))];
}
