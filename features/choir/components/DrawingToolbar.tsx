"use client";

import { ToolType } from "../hooks/useCanvasDrawing";

interface DrawingToolbarProps {
  tool: ToolType;
  onToolChange: (tool: ToolType) => void;
  color: string;
  onColorChange: (color: string) => void;
  lineWidth: number;
  onLineWidthChange: (width: number) => void;
  onClear: () => void;
  enabled: boolean;
}

const COLORS = [
  "#000000",
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#a855f7",
  "#f97316",
];

const TOOLS: { label: string; value: ToolType; icon: React.ReactNode }[] = [
  {
    label: "펜",
    value: "pen",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
    ),
  },
  {
    label: "하이라이트",
    value: "highlighter",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
  },
  {
    label: "지우개",
    value: "eraser",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    ),
  },
];

export default function DrawingToolbar({
  tool,
  onToolChange,
  color,
  onColorChange,
  lineWidth,
  onLineWidthChange,
  onClear,
  enabled,
}: DrawingToolbarProps) {
  if (!enabled) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
      {/* 도구 선택 */}
      <div className="flex items-center gap-1">
        {TOOLS.map((t) => (
          <button
            key={t.value}
            onClick={() => onToolChange(t.value)}
            className={`backlight-hover w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
              tool === t.value
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
            title={t.label}
          >
            {t.icon}
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

      {/* 색상 선택 */}
      <div className="flex items-center gap-1">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => onColorChange(c)}
            className={`backlight-hover w-6 h-6 rounded-full border-2 transition-transform ${
              color === c
                ? "border-blue-500 scale-110"
                : "border-transparent"
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

      {/* 선 두께 */}
      <input
        type="range"
        min="1"
        max="10"
        value={lineWidth}
        onChange={(e) => onLineWidthChange(Number(e.target.value))}
        className="w-16 accent-blue-500"
      />

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

      {/* 지우기 */}
      <button
        onClick={onClear}
        className="backlight-hover w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
        title="전체 지우기"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}
