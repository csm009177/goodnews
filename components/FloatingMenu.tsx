"use client";

import { useState, useEffect, useRef } from "react";

interface FloatingMenuProps {
  items: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  }[];
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

export default function FloatingMenu({
  items,
  position = "bottom-right",
}: FloatingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const positionClasses = {
    "bottom-right": "bottom-20 right-4",
    "bottom-left": "bottom-20 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  };

  const menuPositionClasses = {
    "bottom-right": "bottom-full right-0 mb-2",
    "bottom-left": "bottom-full left-0 mb-2",
    "top-right": "top-full right-0 mt-2",
    "top-left": "top-full left-0 mt-2",
  };

  return (
    <div ref={menuRef} className={`fixed ${positionClasses[position]} z-40`}>
      {isOpen && (
        <div
          className={`absolute ${menuPositionClasses[position]} bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden`}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className="backlight-hover flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap cursor-default"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="backlight-hover w-12 h-12 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
