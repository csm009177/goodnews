"use client";

import { useState } from "react";
import { useAuth } from "./context";
import { Modal, Button } from "@/components";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      onClose();
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="로그인" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            취소
          </Button>
        </div>

        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">
            데모 계정
          </p>
          <div className="space-y-1 text-xs text-gray-400 dark:text-gray-500">
            <p>관리자: admin@goodnews.kr / admin123</p>
            <p>목사님: pastor@goodnews.kr / pastor123</p>
            <p>지휘자: conductor@goodnews.kr / conductor123</p>
            <p>단원: member@goodnews.kr / member123</p>
          </div>
        </div>
      </form>
    </Modal>
  );
}