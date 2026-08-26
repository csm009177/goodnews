"use client";

import { useState, useEffect } from "react";
import { Modal, Button } from "@/components";
import { ScheduleEvent } from "../services/schedule-data";

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<ScheduleEvent, "id" | "createdAt">) => void;
  editEvent?: ScheduleEvent | null;
}

export default function EventFormModal({
  isOpen,
  onClose,
  onSave,
  editEvent,
}: EventFormModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [color, setColor] = useState("#3b82f6");

  const COLORS = [
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#ec4899", // pink
  ];

  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title);
      setDescription(editEvent.description || "");
      setDate(editEvent.date);
      setStartTime(editEvent.startTime || "");
      setEndTime(editEvent.endTime || "");
      setLocation(editEvent.location || "");
      setColor(editEvent.color || "#3b82f6");
    } else {
      setTitle("");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
      setStartTime("");
      setEndTime("");
      setLocation("");
      setColor("#3b82f6");
    }
  }, [editEvent, isOpen]);

  const handleSubmit = () => {
    if (!title.trim() || !date) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      date,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      location: location.trim() || undefined,
      color,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editEvent ? "일정 수정" : "일정 추가"}>
      <div className="space-y-4">
        {/* 제목 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="일정 제목을 입력하세요"
          />
        </div>

        {/* 설명 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            설명
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="일정 설명을 입력하세요"
          />
        </div>

        {/* 날짜 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            날짜 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 시간 */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              시작 시간
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              종료 시간
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 장소 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            장소
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="장소를 입력하세요"
          />
        </div>

        {/* 색상 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            색상
          </label>
          <div className="flex items-center gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full transition-transform ${
                  color === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="primary" onClick={handleSubmit} disabled={!title.trim() || !date}>
            {editEvent ? "수정" : "추가"}
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
        </div>
      </div>
    </Modal>
  );
}