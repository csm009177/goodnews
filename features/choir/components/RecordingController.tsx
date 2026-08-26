"use client";

interface RecordingControllerProps {
  isRecording: boolean;
  duration: number;
  audioUrl: string | null;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onDownload: () => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function RecordingController({
  isRecording,
  duration,
  audioUrl,
  onStart,
  onStop,
  onReset,
  onDownload,
}: RecordingControllerProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-3">
        {/* 녹음 버튼 */}
        <button
          onClick={isRecording ? onStop : onStart}
          className={`backlight-hover w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}
          title={isRecording ? "녹음 중지" : "녹음 시작"}
        >
          {isRecording ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8" />
            </svg>
          )}
        </button>

        {/* 타이머 */}
        <div className="flex-1">
          <p className="text-sm font-mono font-medium text-gray-900 dark:text-gray-100">
            {formatDuration(duration)}
          </p>
          {isRecording && (
            <p className="text-xs text-red-500 dark:text-red-400">녹음 중</p>
          )}
        </div>

        {/* 오디오 컨트롤 */}
        {audioUrl && !isRecording && (
          <div className="flex items-center gap-2">
            <audio src={audioUrl} controls className="h-8" />
            <button
              onClick={onDownload}
              className="backlight-hover w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400"
              title="다운로드"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
            <button
              onClick={onReset}
              className="backlight-hover w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400"
              title="초기화"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
