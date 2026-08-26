"use client";

import { useState, useRef, useEffect } from "react";
import { ScheduleEvent } from "../services/schedule-data";

interface CalendarViewProps {
  events: ScheduleEvent[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onEventClick: (event: ScheduleEvent) => void;
}

export default function CalendarView({
  events,
  selectedDate,
  onDateSelect,
  onEventClick,
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = new Date(selectedDate);
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfWeek = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const formatDate = (day: number): string => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${month}-${d}`;
  };

  const getEventsForDay = (day: number): ScheduleEvent[] => {
    const dateStr = formatDate(day);
    return events.filter((e) => e.date === dateStr);
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return (
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate()
    );
  };

  const isSelected = (day: number): boolean => {
    const dateStr = formatDate(day);
    return dateStr === selectedDate;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={prevMonth}
          className="backlight-hover w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
        </h3>
        <button
          onClick={nextMonth}
          className="backlight-hover w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div
            key={day}
            className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7">
        {emptyDays.map((i) => (
          <div key={`empty-${i}`} className="h-20 border-b border-r border-gray-100 dark:border-gray-700/50" />
        ))}
        {days.map((day) => {
          const dateStr = formatDate(day);
          const dayEvents = getEventsForDay(day);
          const today = isToday(day);
          const selected = isSelected(day);

          return (
            <button
              key={day}
              onClick={() => onDateSelect(dateStr)}
              className={`backlight-hover h-20 border-b border-r border-gray-100 dark:border-gray-700/50 p-1 text-left relative ${
                selected
                  ? "bg-blue-50 dark:bg-blue-900/20"
                  : ""
              }`}
            >
              <span
                className={`inline-flex items-center justify-center w-6 h-6 text-sm rounded-full ${
                  today
                    ? "bg-blue-600 text-white"
                    : selected
                    ? "text-blue-600 dark:text-blue-400 font-bold"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {day}
              </span>
              <div className="mt-0.5 space-y-0.5">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className="text-xs truncate px-1 py-0.5 rounded"
                    style={{
                      backgroundColor: event.color + "20",
                      color: event.color,
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 px-1">
                    +{dayEvents.length - 2}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
