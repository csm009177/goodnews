export interface Hymn {
  number: number;
  title: string;
  content: string;
  category: "hymn" | "naeyoung";
}

// TODO: 실제 API 또는 데이터베이스 연동
// 현재는 데모 데이터를 사용합니다

const DEMO_HYMN: Hymn[] = [
  {
    number: 1,
    title: "예수 다시 오실 때",
    content: `예수 다시 오실 때 그 날이 올 때
기쁨으로 영접하리
그 날이 올 때 그 날이 올 때
기쁨으로 영접하리

예수 다시 오실 때 그 날이 올 때
기쁨으로 영접하리
그 날이 올 때 그 날이 올 때
기쁨으로 영접하리`,
    category: "hymn",
  },
  {
    number: 2,
    title: "예수 그리스도 사랑",
    content: `예수 그리스도 사랑 그 사랑은 크도다
예수 그리스도 사랑 그 사랑은 크도다

십자가 위에서 나를 위하여
그의 생명을 바치셨도다
예수 그리스도 사랑 그 사랑은 크도다`,
    category: "hymn",
  },
  {
    number: 3,
    title: "하나님 사랑",
    content: `하나님 사랑 그 사랑은 크도다
그 사랑은 크도다 그 사랑은 크도다

하나님 사랑 그 사랑은 크도다
그 사랑은 크도다 그 사랑은 크도다`,
    category: "hymn",
  },
];

const DEMO_NAEYOUNG: Hymn[] = [
  {
    number: 1,
    title: "내영의노래 1",
    content: `내영의노래 첫 번째 곡
가사 내용이 여기에 들어갑니다

(후렴)
주님 우리는 감사드립니다
주님 우리는 감사드립니다`,
    category: "naeyoung",
  },
  {
    number: 2,
    title: "내영의노래 2",
    content: `내영의노래 두 번째 곡
가사 내용이 여기에 들어갑니다

(후렴)
주님의 사랑은 크도다
주님의 사랑은 크도다`,
    category: "naeyoung",
  },
];

export function getAllHymns(): Hymn[] {
  return [...DEMO_HYMN, ...DEMO_NAEYOUNG];
}

export function getHymnByNumber(number: number): Hymn | undefined {
  return [...DEMO_HYMN, ...DEMO_NAEYOUNG].find((h) => h.number === number);
}

export function searchHymns(query: string, category?: "hymn" | "naeyoung"): Hymn[] {
  const allHymns = category
    ? (category === "hymn" ? DEMO_HYMN : DEMO_NAEYOUNG)
    : [...DEMO_HYMN, ...DEMO_NAEYOUNG];

  const lowerQuery = query.toLowerCase();
  return allHymns.filter(
    (hymn) =>
      hymn.title.toLowerCase().includes(lowerQuery) ||
      hymn.content.toLowerCase().includes(lowerQuery) ||
      hymn.number.toString().includes(query)
  );
}
