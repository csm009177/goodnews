"use client";

import { useEffect, useState, useCallback } from "react";
import { FloatingMenu } from "@/components";
import { useDeviceType } from "@/components/useDeviceType";
import Link from "next/link";

export default function FullscreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const deviceType = useDeviceType();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    if (deviceType !== "desktop") return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "F11") {
        e.preventDefault();
        toggleFullscreen();
      }
      if (e.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deviceType, toggleFullscreen]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* 메인 콘텐츠 */}
      {children}

      {/* 반투명 플로팅 햄버거 메뉴 */}
      <FloatingMenu
        position="bottom-right"
        items={[
          {
            label: isFullscreen ? "전체화면 해제" : "전체화면",
            onClick: toggleFullscreen,
          },
          {
            label: "메인으로 돌아가기",
            onClick: () => (window.location.href = "/"),
          },
          {
            label: "악보 보기",
            onClick: () => (window.location.href = "/sheet"),
          },
          {
            label: "합창 모드",
            onClick: () => (window.location.href = "/choir"),
          },
        ]}
      />
    </div>
  );
}
