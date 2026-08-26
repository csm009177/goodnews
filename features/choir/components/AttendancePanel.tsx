"use client";

import { ChoirMember } from "../services/choir-data";

interface AttendancePanelProps {
  members: ChoirMember[];
  title?: string;
}

export default function AttendancePanel({
  members,
  title = "출석 현황",
}: AttendancePanelProps) {
  const roleLabels: Record<ChoirMember["role"], string> = {
    CONDUCTOR: "지휘자",
    PART_LEADER: "파트장",
    MEMBER: "단원",
  };

  const roleColors: Record<ChoirMember["role"], string> = {
    CONDUCTOR: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    PART_LEADER: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    MEMBER: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
          {members.length}명
        </span>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {members.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            접속한 멤버가 없습니다
          </div>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 px-4 py-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {member.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {member.name}
                </p>
                {member.part && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {member.part}
                  </p>
                )}
              </div>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  roleColors[member.role]
                }`}
              >
                {roleLabels[member.role]}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
