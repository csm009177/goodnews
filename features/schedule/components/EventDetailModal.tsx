"use client";

import { ScheduleEvent } from "../services/schedule-data";
import { Modal, Button } from "@/components";

interface EventDetailModalProps {
  event: ScheduleEvent | null;
  onClose: () => void;
  onUpdate?: (event: ScheduleEvent) => void;
  onDelete?: (id: string) => void;
}

export default function EventDetailModal({
  event,
  onClose,
  onUpdate,
  onDelete,
}: EventDetailModalProps) {
  if (!event) return null;

  return (
    <Modal isOpen={!!event} onClose={onClose} title="일정 상세">
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {event.title}
          </h4>
          {event.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {event.description}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>📅</span>
            <span>{event.date}</span>
          </div>
          {event.startTime && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>🕐</span>
              <span>
                {event.startTime}
                {event.endTime && ` - ${event.endTime}`}
              </span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>📍</span>
              <span>{event.location}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          {onDelete && (
            <Button variant="danger" size="sm" onClick={() => onDelete(event.id)}>
              삭제
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
