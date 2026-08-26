"use client";

import { useDeviceType } from "@/components/useDeviceType";
import { FloatingMenu } from "@/components";
import Link from "next/link";

export default function Home() {
  const deviceType = useDeviceType();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          GOODNEWS MISSION ONE
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          선교회 특화 통합 원앱
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <Link
            href="/bible"
            className="backlight-hover bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="text-3xl mb-3">📖</div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              성경
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              개역한글 / KJV
            </p>
          </Link>

          <Link
            href="/hymn"
            className="backlight-hover bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="text-3xl mb-3">🎵</div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              찬송가
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              찬송가 / 내영의노래
            </p>
          </Link>

          <Link
            href="/schedule"
            className="backlight-hover bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="text-3xl mb-3">📅</div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              일정/공지
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              공지사항 / 달력
            </p>
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            합창단 기능
          </h3>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/sheet"
              className="backlight-hover px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300"
            >
              악보 보기
            </Link>
            <Link
              href="/choir"
              className="backlight-hover px-4 py-2 bg-blue-600 dark:bg-blue-500 rounded-lg text-sm text-white"
            >
              합창 모드
            </Link>
          </div>
        </div>
      </div>

      {/* 모바일/태블릿용 플로팅 메뉴 */}
      {deviceType !== "desktop" && (
        <FloatingMenu
          position="bottom-right"
          items={[
            {
              label: "성경",
              onClick: () => (window.location.href = "/bible"),
            },
            {
              label: "찬송가",
              onClick: () => (window.location.href = "/hymn"),
            },
            {
              label: "일정/공지",
              onClick: () => (window.location.href = "/schedule"),
            },
            {
              label: "합창 모드",
              onClick: () => (window.location.href = "/choir"),
            },
          ]}
        />
      )}
    </div>
  );
}
