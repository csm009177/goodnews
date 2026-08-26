"use client";

import { ScheduleEvent } from "../services/schedule-data";

interface StreamViewProps {
  events: ScheduleEvent[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onEventClick: (event: ScheduleEvent) => void;
}

export default function StreamView({
  events,
  selectedDate,
  onDateSelect,
  onEventClick,
}: StreamViewProps) {
  // 날짜별로 그룹화
  const groupedEvents = events.reduce(
    (acc, event) => {
      const date = event.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    },
    {} as Record<string, ScheduleEvent[]>
  );

  // 날짜 순으로 정렬
  const sortedDates = Object.keys(groupedEvents).sort();

  if (sortedDates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-sm">일정이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedDates.map((date) => {
        const isToday = date === new Date().toISOString().split("T")[0];
        const isSelected = date === selectedDate;
        const dayEvents = groupedEvents[date];

        return (
          <div key={date}>
            {/* 날짜 헤더 */}
            <button
              onClick={() => onDateSelect(date)}
              className={`backlight-hover w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
                isSelected
                  ? "bg-blue-50 dark:bg-blue-900/20"
                  : "bg-gray-50 dark:bg-gray-800/50"
              }`}
            >
              <div
                className={`w-10 h-10 flex flex-col items-center justify-center rounded-lg ${
                  isToday
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <span className="text-xs font-medium leading-none">
                  {new Date(date).toLocaleDateString("ko-KR", { weekday: "short" })}
                </span>
                <span className="text-lg font-bold leading-none">
                  {new Date(date).getDate()}
                </span>
              </div>
              <div className="flex-1 text-left">
                <p
                  className={`text-sm font-medium ${
                    isSelected
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {date}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {dayEvents.length}개의 일정
                </p>
              </div>
            </button>

            {/* 일정 목록 */}
            <div className="ml-5 space-y-2">
              {dayEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className="backlight-hover w-full text-left p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-1 h-full min-h-[40px] rounded-full flex-shrink-0"
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {event.title}
                      </h4>
                      {event.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                          {event.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        {event.startTime && (
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            🕐 {event.startTime}
                            {event.endTime && ` - ${event.endTime}`}
                          </span>
                        )}
                        {event.location && (
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            📍 {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
