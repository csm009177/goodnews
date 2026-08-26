export interface ChoirMember {
  id: string;
  name: string;
  role: "CONDUCTOR" | "PART_LEADER" | "MEMBER";
  part?: string; // 소프라노, 알토, 테너, 베이스
  joinedAt: string;
  lastActiveAt: string;
}

export interface AttendanceLog {
  id: string;
  memberId: string;
  memberName: string;
  date: string;
  joinTime: string;
  leaveTime?: string;
  duration: number; // 분
}

export interface CanvasAnnotation {
  id: string;
  memberId: string;
  memberName: string;
  type: "pen" | "highlighter" | "eraser";
  color: string;
  data: unknown; // Canvas path data
  timestamp: string;
}

export interface RecordingSession {
  id: string;
  title: string;
  memberId: string;
  memberName: string;
  audioUrl: string;
  duration: number; // 초
  createdAt: string;
}

// TODO: 실제 API 연동
const DEMO_MEMBERS: ChoirMember[] = [
  {
    id: "1",
    name: "지휘자 김",
    role: "CONDUCTOR",
    joinedAt: "2026-01-01T00:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "파트장 이",
    role: "PART_LEADER",
    part: "소프라노",
    joinedAt: "2026-01-01T00:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "단원 박",
    role: "MEMBER",
    part: "알토",
    joinedAt: "2026-03-01T00:00:00Z",
    lastActiveAt: new Date().toISOString(),
  },
];

export function getChoirMembers(): ChoirMember[] {
  return [...DEMO_MEMBERS];
}

export function getOnlineMembers(): ChoirMember[] {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  return DEMO_MEMBERS.filter((m) => m.lastActiveAt >= fiveMinutesAgo);
}

export function getAttendanceLogs(): AttendanceLog[] {
  return [];
}

export function createAttendanceLog(member: ChoirMember): AttendanceLog {
  return {
    id: Date.now().toString(),
    memberId: member.id,
    memberName: member.name,
    date: new Date().toISOString().split("T")[0],
    joinTime: new Date().toISOString(),
    duration: 0,
  };
}
