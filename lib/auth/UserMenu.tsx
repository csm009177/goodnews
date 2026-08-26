"use client";

import { useState } from "react";
import { useAuth } from "./context";
import { Role } from "@/lib/utils/roles";
import LoginModal from "./LoginModal";

export default function UserMenu() {
  const { user, logout, hasPermission } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const roleLabels: Record<Role, string> = {
    GUEST: "비가입자",
    USER: "유저",
    CHOIR_MEMBER: "합창단",
    PART_LEADER: "파트장",
    CONDUCTOR: "지휘자",
    PASTOR: "목사님",
    ADMIN: "관리자",
  };

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowLogin(true)}
          className="backlight-hover px-3 py-1.5 bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-sm font-medium"
        >
          로그인
        </button>
        <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      </>
    );
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="backlight-hover flex items-center gap-2 px-3 py-1.5 rounded-lg"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {user.name.charAt(0)}
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {user.name}
          </span>
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-40 overflow-hidden">
            <div className="p-3 border-b border-gray-100 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-medium">
                {roleLabels[user.role]}
              </span>
            </div>

            <div className="p-2">
              {hasPermission("PASTOR") && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="backlight-hover w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                >
                  📢 공지 관리
                </button>
              )}

              {hasPermission("CONDUCTOR") && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="backlight-hover w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                >
                  🎼 악보 관리
                </button>
              )}

              {user.role === "ADMIN" && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="backlight-hover w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                >
                  ⚙️ 시스템 설정
                </button>
              )}

              <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="backlight-hover w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}