/**
 * 권한 역할 정의
 */

export type Role =
  | "GUEST"
  | "USER"
  | "CHOIR_MEMBER"
  | "PART_LEADER"
  | "CONDUCTOR"
  | "PASTOR"
  | "ADMIN";

export const ROLE_HIERARCHY: Record<Role, number> = {
  GUEST: 0,
  USER: 1,
  CHOIR_MEMBER: 2,
  PART_LEADER: 3,
  CONDUCTOR: 3,
  PASTOR: 4,
  ADMIN: 4,
};

export function hasPermission(
  userRole: Role,
  requiredRole: Role
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canDrawOnSheet(role: Role): boolean {
  return (
    role === "CONDUCTOR" ||
    role === "PART_LEADER" ||
    role === "PASTOR" ||
    role === "ADMIN"
  );
}

export function canManageAnnouncements(role: Role): boolean {
  return role === "PASTOR" || role === "ADMIN";
}

export function canRecordAudio(role: Role): boolean {
  return (
    role === "CONDUCTOR" ||
    role === "PART_LEADER" ||
    role === "PASTOR" ||
    role === "ADMIN"
  );
}
