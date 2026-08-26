"use client";

import { useEffect, useState, useRef } from "react";
import { useChoirSocket } from "@/features/choir/hooks/useChoirSocket";
import { useCanvasDrawing } from "@/features/choir/hooks/useCanvasDrawing";
import { useRecorder } from "@/features/choir/hooks/useRecorder";
import { getChoirMembers, getOnlineMembers } from "@/features/choir/services/choir-data";
import { canDrawOnSheet } from "@/lib/utils/roles";
import AttendancePanel from "@/features/choir/components/AttendancePanel";
import DrawingToolbar from "@/features/choir/components/DrawingToolbar";
import RecordingController from "@/features/choir/components/RecordingController";

export default function ChoirPage() {
  const { connected, onlineMembers, connect, disconnect } = useChoirSocket();
  const { isRecording, duration, audioUrl, startRecording, stopRecording, resetRecording, downloadRecording } = useRecorder();
  const [showSidePanel, setShowSidePanel] = useState(true);

  // Canvas 설정
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const {
    tool,
    setTool,
    color,
    setColor,
    lineWidth,
    setLineWidth,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
  } = useCanvasDrawing(drawingCanvasRef, true);

  // 합창 모드 진입 시 WebSocket 연결
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Canvas 크기 조정
  useEffect(() => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <div className="relative w-full h-full flex">
      {/* 메인 캔버스 영역 */}
      <div className="flex-1 relative">
        {/* 지휘자 미러링 캔버스 (배경) */}
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="text-center text-white/50">
            <svg className="w-20 h-20 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
            <p className="text-lg font-medium">지휘자 화면</p>
            <p className="text-sm mt-1">지휘자가 악보를 공유하면 여기에 표시됩니다</p>
          </div>
        </div>

        {/* 필기 캔버스 (오버레이) */}
        <canvas
          ref={drawingCanvasRef}
          className="absolute inset-0 z-10"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {/* 연결 상태 표시 */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-lg">
          <div
            className={`w-2 h-2 rounded-full ${
              connected ? "bg-green-400" : "bg-red-400"
            }`}
          />
          <span className="text-xs text-white/80">
            {connected ? "연결됨" : "연결 끊김"}
          </span>
        </div>

        {/* 사이드 패널 토글 */}
        <button
          onClick={() => setShowSidePanel(!showSidePanel)}
          className="absolute top-4 right-4 z-20 backlight-hover w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-md rounded-lg text-white/80"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* 드로잉 툴바 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <DrawingToolbar
            tool={tool}
            onToolChange={setTool}
            color={color}
            onColorChange={setColor}
            lineWidth={lineWidth}
            onLineWidthChange={setLineWidth}
            onClear={clearCanvas}
            enabled={true}
          />
        </div>
      </div>

      {/* 사이드 패널 */}
      {showSidePanel && (
        <div className="w-80 border-l border-white/10 bg-black/80 backdrop-blur-md overflow-y-auto p-4 space-y-4">
          {/* 출석 현황 */}
          <AttendancePanel members={onlineMembers} />

          {/* 녹음 컨트롤러 */}
          <RecordingController
            isRecording={isRecording}
            duration={duration}
            audioUrl={audioUrl}
            onStart={startRecording}
            onStop={stopRecording}
            onReset={resetRecording}
            onDownload={downloadRecording}
          />
        </div>
      )}
    </div>
  );
}
