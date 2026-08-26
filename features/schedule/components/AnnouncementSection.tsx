"use client";

import { Announcement } from "../services/schedule-data";
import { RequireRole } from "@/lib/auth";

interface AnnouncementSectionProps {
  announcements: Announcement[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  onAddAnnouncement?: () => void;
}

export default function AnnouncementSection({
  announcements,
  collapsed,
  onToggleCollapse,
  onAddAnnouncement,
}: AnnouncementSectionProps) {
  const pinnedAnnouncements = announcements.filter((a) => a.pinned);
  const normalAnnouncements = announcements.filter((a) => !a.pinned);

  if (announcements.length === 0) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <button
          onClick={onToggleCollapse}
          className="backlight-hover w-full flex items-center justify-between py-3 cursor-default"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              📢 공지사항
            </span>
            {pinnedAnnouncements.length > 0 && (
              <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs font-medium">
                고정 {pinnedAnnouncements.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* 공지 등록 버튼 - PASTOR 이상만 표시 */}
            <RequireRole role="PASTOR">
              <button
                onClick={onAddAnnouncement}
                className="backlight-hover px-2 py-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md text-xs font-medium transition-colors"
                title="공지 등록"
              >
                + 등록
              </button>
            </RequireRole>
            <svg
            className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
              collapsed ? "" : "rotate-180"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* 공지 목록 */}
        {!collapsed && (
          <div className="pb-3 space-y-2">
            {/* 고정 공지 */}
            {pinnedAnnouncements.map((announcement) => (
              <AnnouncementItem
                key={announcement.id}
                announcement={announcement}
                pinned
              />
            ))}

            {/* 일반 공지 */}
            {normalAnnouncements.map((announcement) => (
              <AnnouncementItem
                key={announcement.id}
                announcement={announcement}
                pinned={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AnnouncementItem({
  announcement,
  pinned,
}: {
  announcement: Announcement;
  pinned: boolean;
}) {
  return (
    <div
      className={`backlight-hover p-3 rounded-lg ${
        pinned
          ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {pinned && (
              <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-xs font-medium">
                고정
              </span>
            )}
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {announcement.title}
            </h4>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {announcement.content}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {announcement.author}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(announcement.createdAt).toLocaleDateString("ko-KR")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
