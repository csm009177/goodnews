"use client";

import React from "react";
import { useRef, useCallback, useState } from "react";

export type ToolType = "pen" | "highlighter" | "eraser";

export interface CanvasDrawingState {
  isDrawing: boolean;
  tool: ToolType;
  color: string;
  lineWidth: number;
}

export function useCanvasDrawing(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  enabled: boolean = true
) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<ToolType>("pen");
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const getCtx = useCallback(() => {
    return canvasRef.current?.getContext("2d");
  }, [canvasRef]);

  const getPos = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      if ("touches" in e) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        };
      }
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    [canvasRef]
  );

  const startDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!enabled) return;
      setIsDrawing(true);
      lastPosRef.current = getPos(e);
    },
    [enabled, getPos]
  );

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing || !enabled) return;

      const ctx = getCtx();
      if (!ctx) return;

      const pos = getPos(e);
      const lastPos = lastPosRef.current;

      if (!lastPos) return;

      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(pos.x, pos.y);

      switch (tool) {
        case "pen":
          ctx.strokeStyle = color;
          ctx.lineWidth = lineWidth;
          ctx.lineCap = "round";
          ctx.stroke();
          break;
        case "highlighter":
          ctx.strokeStyle = color + "40"; // 25% opacity
          ctx.lineWidth = lineWidth * 4;
          ctx.lineCap = "square";
          ctx.stroke();
          break;
        case "eraser":
          ctx.globalCompositeOperation = "destination-out";
          ctx.lineWidth = lineWidth * 3;
          ctx.lineCap = "round";
          ctx.stroke();
          ctx.globalCompositeOperation = "source-over";
          break;
      }

      lastPosRef.current = pos;
    },
    [isDrawing, enabled, getCtx, getPos, tool, color, lineWidth]
  );

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    lastPosRef.current = null;
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [canvasRef, getCtx]);

  return {
    isDrawing,
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
  };
}
