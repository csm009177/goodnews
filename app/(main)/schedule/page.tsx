"use client";

import { useSchedule } from "@/features/schedule/hooks/useSchedule";
import { getAnnouncements, getScheduleEvents } from "@/features/schedule/services/schedule-data";
import { RequireRole } from "@/lib/auth";
import AnnouncementSection from "@/features/schedule/components/AnnouncementSection";
import CalendarView from "@/features/schedule/components/CalendarView";
import StreamView from "@/features/schedule/components/StreamView";
import EventDetailModal from "@/features/schedule/components/EventDetailModal";
import { Announcement, ScheduleEvent } from "@/features/schedule/services/schedule-data";
import { useEffect, useState } from "react";

export default function SchedulePage() {
  const {
    viewMode,
    setViewMode,
    selectedDate,
    setSelectedDate,
    collapsedAnnouncements,
    toggleAnnouncementCollapse,
  } = useSchedule();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

  useEffect(() => {
    setAnnouncements(getAnnouncements());
    setEvents(getScheduleEvents());
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* 공지사항 섹션 */}
      <AnnouncementSection
        announcements={announcements}
        collapsed={collapsedAnnouncements}
        onToggleCollapse={toggleAnnouncementCollapse}
      />

      {/* 상단 컨트롤 바 */}
      <div className="sticky top-14 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* 뷰 모드 토글 */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode("CALENDAR")}
              className={`backlight-hover px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === "CALENDAR"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              달력
            </button>
            <button
              onClick={() => setViewMode("STREAM")}
              className={`backlight-hover px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === "STREAM"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              스트림
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-4">
        {viewMode === "CALENDAR" ? (
          <CalendarView
            events={events}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onEventClick={setSelectedEvent}
          />
        ) : (
          <StreamView
            events={events}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onEventClick={setSelectedEvent}
          />
        )}
      </div>

      {/* 일정 상세 모달 */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
