"use client";

import { useAuth } from "./context";
import { Role } from "@/lib/utils/roles";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * 역할 기반 보호 라우트 컴포넌트
 * 필요한 권한이 없으면 로그인 모달을 표시하거나 리다이렉트
 */
export function ProtectedRoute({
  children,
  requiredRole,
  fallback,
}: {
  children: React.ReactNode;
  requiredRole: Role;
  fallback?: React.ReactNode;
}) {
  const { user, loading, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && !hasPermission(requiredRole)) {
      // 권한이 없으면 메인 페이지로 이동
      router.push("/");
    }
  }, [user, loading, hasPermission, requiredRole, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return fallback || (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-600 dark:text-gray-400">로그인이 필요합니다.</p>
      </div>
    );
  }

  if (!hasPermission(requiredRole)) {
    return fallback || (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-600 dark:text-gray-400">접근 권한이 없습니다.</p>
      </div>
    );
  }

  return <>{children}</>;
}