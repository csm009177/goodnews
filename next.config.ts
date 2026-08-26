import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 이미지 최적화
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Capacitor 호환성 설정
  // Next.js App Router + Capacitor를 위해 output 설정
  // (Capacitor는 정적 파일을 필요로 함)
  // output: "export", // 정적 내보내기 모드 (필요시 활성화)

  // API route 타임아웃 (R2 presigned URL 생성용)
  experimental: {
    // API route body size limit
  },

  // 헤더 설정
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
