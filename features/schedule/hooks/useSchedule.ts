"use client";

import { useState, useCallback } from "react";
import { Announcement, ScheduleEvent } from "../services/schedule-data";

export type ScheduleViewMode = "CALENDAR" | "STREAM";

export function useSchedule() {
  const [viewMode, setViewMode] = useState<ScheduleViewMode>("CALENDAR");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [collapsedAnnouncements, setCollapsedAnnouncements] = useState(false);

  const toggleAnnouncementCollapse = useCallback(() => {
    setCollapsedAnnouncements((prev) => !prev);
  }, []);

  const addAnnouncement = useCallback(
    (announcement: Announcement) => {
      setAnnouncements((prev) => [announcement, ...prev]);
    },
    []
  );

  const addEvent = useCallback((event: ScheduleEvent) => {
    setEvents((prev) => [...prev, event]);
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<ScheduleEvent>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const getEventsForSelectedDate = useCallback(() => {
    return events.filter((e) => e.date === selectedDate);
  }, [events, selectedDate]);

  return {
    viewMode,
    setViewMode,
    announcements,
    events,
    selectedDate,
    setSelectedDate,
    collapsedAnnouncements,
    toggleAnnouncementCollapse,
    addAnnouncement,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForSelectedDate,
  };
}
