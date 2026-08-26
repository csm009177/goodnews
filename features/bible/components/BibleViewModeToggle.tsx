"use client";

import { useState } from "react";

interface BibleViewModeToggleProps {
  viewMode: "KOREAN" | "KJV" | "BOTH";
  onViewModeChange: (mode: "KOREAN" | "KJV" | "BOTH") => void;
}

export default function BibleViewModeToggle({
  viewMode,
  onViewModeChange,
}: BibleViewModeToggleProps) {
  const modes: { label: string; value: "KOREAN" | "KJV" | "BOTH" }[] = [
    { label: "한글", value: "KOREAN" },
    { label: "영문", value: "KJV" },
    { label: "같이보기", value: "BOTH" },
  ];

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onViewModeChange(mode.value)}
          className={`backlight-hover px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            viewMode === mode.value
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
