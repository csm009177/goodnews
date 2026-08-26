export interface Announcement {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  color?: string;
  createdAt: string;
}

// TODO: 실제 API 또는 데이터베이스 연동
const DEMO_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "주일 예배 시간 변경 안내",
    content: "다음 주일부터 주일 예배 시간이 오전 10시로 변경됩니다. 많은 참석 부탁드립니다.",
    pinned: true,
    author: "기관장",
    createdAt: "2026-08-20T09:00:00Z",
    updatedAt: "2026-08-20T09:00:00Z",
  },
  {
    id: "2",
    title: "합창단 연습 일정",
    content: "매주 수요일 저녁 7시에 합창단 연습이 진행됩니다.",
    pinned: false,
    author: "지휘자",
    createdAt: "2026-08-18T15:00:00Z",
    updatedAt: "2026-08-18T15:00:00Z",
  },
];

const DEMO_EVENTS: ScheduleEvent[] = [
  {
    id: "1",
    title: "주일 예배",
    description: "매주 주일 예배",
    date: "2026-08-30",
    startTime: "10:00",
    endTime: "11:30",
    location: "본당",
    color: "#3b82f6",
    createdAt: "2026-08-01T00:00:00Z",
  },
  {
    id: "2",
    title: "합창단 연습",
    description: "합창단 정기 연습",
    date: "2026-08-26",
    startTime: "19:00",
    endTime: "21:00",
    location: "연습실",
    color: "#8b5cf6",
    createdAt: "2026-08-01T00:00:00Z",
  },
];

export function getAnnouncements(): Announcement[] {
  return [...DEMO_ANNOUNCEMENTS].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function getScheduleEvents(): ScheduleEvent[] {
  return [...DEMO_EVENTS];
}

export function getEventsByDate(date: string): ScheduleEvent[] {
  return DEMO_EVENTS.filter((e) => e.date === date);
}

export function createAnnouncement(
  title: string,
  content: string,
  author: string,
  pinned: boolean = false
): Announcement {
  const now = new Date().toISOString();
  return {
    id: Date.now().toString(),
    title,
    content,
    pinned,
    author,
    createdAt: now,
    updatedAt: now,
  };
}

export function createScheduleEvent(
  title: string,
  description: string,
  date: string,
  startTime?: string,
  endTime?: string,
  location?: string,
  color?: string
): ScheduleEvent {
  return {
    id: Date.now().toString(),
    title,
    description,
    date,
    startTime,
    endTime,
    location,
    color: color || "#3b82f6",
    createdAt: new Date().toISOString(),
  };
}
