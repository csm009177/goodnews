"use client";

import { useEffect } from "react";

interface KeyboardShortcutProps {
  enabled: boolean;
  shortcuts: {
    key: string;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    action: () => void;
    preventDefault?: boolean;
  }[];
}

export default function KeyboardShortcuts({
  enabled,
  shortcuts,
}: KeyboardShortcutProps) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = !!shortcut.ctrlKey === !!e.ctrlKey;
        const shiftMatch = !!shortcut.shiftKey === !!e.shiftKey;
        const altMatch = !!shortcut.altKey === !!e.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          if (shortcut.preventDefault !== false) {
            e.preventDefault();
          }
          shortcut.action();
          break;
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enabled, shortcuts]);

  return null;
}
