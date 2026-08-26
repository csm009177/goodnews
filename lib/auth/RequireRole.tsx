"use client";

import { useAuth } from "./context";
import { Role } from "@/lib/utils/roles";

/**
 * 권한 기반 조건부 렌더링 컴포넌트
 * 필요한 역할 이상의 권한이 있을 때만 자식을 렌더링
 */
export function RequireRole({
  children,
  role,
  fallback,
}: {
  children: React.ReactNode;
  role: Role;
  fallback?: React.ReactNode;
}) {
  const { hasPermission } = useAuth();

  if (!hasPermission(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * 로그인된 사용자만 표시
 */
export function RequireAuth({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * 비로그인 사용자만 표시
 */
export function RequireGuest({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { user } = useAuth();

  if (user) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}