"use client";

import { useState, useCallback, useRef } from "react";

export interface RecordingState {
  isRecording: boolean;
  duration: number;
  audioUrl: string | null;
  uploading: boolean;
  uploadedUrl: string | null;
  uploadProgress: number;
}

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);

  const resetRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setDuration(0);
  }, [audioUrl]);

  const downloadRecording = useCallback(() => {
    if (!audioUrl) return;

    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `recording-${Date.now()}.webm`;
    a.click();
  }, [audioUrl]);

  const uploadToR2 = useCallback(async () => {
    if (chunksRef.current.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadedUrl(null);

    try {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const fileName = `recording-${Date.now()}.webm`;

      // Presigned URL 요청
      const urlResponse = await fetch("/api/choir/recording/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, contentType: "audio/webm" }),
      });

      if (!urlResponse.ok) {
        throw new Error("업로드 URL 생성 실패");
      }

      const { uploadUrl, fileKey } = await urlResponse.json();

      // 파일 업로드 (ProgressXhr를 통한 진행률 추적)
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader("Content-Type", "audio/webm");

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // 업로드 성공 - 다운로드 URL 생성
          setUploadProgress(100);
          // R2 파일의 공개 URL (presigned download URL 사용)
          const downloadUrl = uploadUrl.split("&X-Amz-")[0]; // Base URL
          setUploadedUrl(downloadUrl);
          setUploading(false);
        } else {
          throw new Error(`업로드 실패: ${xhr.status}`);
        }
      };

      xhr.onerror = () => {
        throw new Error("업로드 중 오류 발생");
      };

      xhr.send(blob);
    } catch (error) {
      console.error("Failed to upload recording:", error);
      setUploading(false);
      setUploadProgress(0);
    }
  }, []);

  return {
    isRecording,
    duration,
    audioUrl,
    uploading,
    uploadedUrl,
    uploadProgress,
    startRecording,
    stopRecording,
    resetRecording,
    downloadRecording,
    uploadToR2,
  };
}
