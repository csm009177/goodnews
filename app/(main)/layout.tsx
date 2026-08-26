"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDeviceType } from "@/components/useDeviceType";
import { useState } from "react";

const navItems = [
  { href: "/bible", label: "성경" },
  { href: "/hymn", label: "찬송가" },
  { href: "/schedule", label: "일정/공지" },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const deviceType = useDeviceType();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isSlimMenu = deviceType === "desktop";

  return (
    <div className="flex flex-col min-h-screen">
      {/* 상단 네비게이션 */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* 로고 */}
            <Link href="/" className="backlight-hover flex items-center gap-2 px-2 py-1 rounded-lg">
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                GOODNEWS
              </span>
            </Link>

            {/* 데스크톱 네비게이션 */}
            {isSlimMenu ? (
              <nav className="flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`backlight-hover px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            ) : (
              /* 모바일/태블릿 햄버거 메뉴 */
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="backlight-hover w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            )}
          </div>

          {/* 모바일 메뉴 드롭다운 */}
          {!isSlimMenu && isMenuOpen && (
            <nav className="py-2 border-t border-gray-100 dark:border-gray-800">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`backlight-hover block px-4 py-3 text-sm font-medium ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1">{children}</main>

      {/* 하단 네비게이션 (모바일/태블릿) */}
      {!isSlimMenu && (
        <nav className="sticky bottom-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-around h-14">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`backlight-hover flex flex-col items-center justify-center px-3 py-1 rounded-lg flex-1 ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <span className="text-xs font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
