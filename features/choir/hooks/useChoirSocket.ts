"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getPusherClient, disconnectPusher } from "@/lib/pusher/client";
import { ChoirMember } from "../services/choir-data";

const CHOIR_CHANNEL = "choir-room";
const MIRroring_EVENT = "mirror-update";
const ATTENDANCE_EVENT = "attendance-update";
const ANNOTATION_EVENT = "annotation-update";

export interface MirrorState {
  currentPage: number;
  annotations: unknown[];
  conductorId: string;
}

export function useChoirSocket() {
  const [connected, setConnected] = useState(false);
  const [onlineMembers, setOnlineMembers] = useState<ChoirMember[]>([]);
  const [mirrorState, setMirrorState] = useState<MirrorState | null>(null);
  const channelRef = useRef<ReturnType<typeof getPusherClient>["subscribe"] | null>(null);

  const connect = useCallback(() => {
    try {
      const pusher = getPusherClient();
      const channel = pusher.subscribe(CHOIR_CHANNEL);
      channelRef.current = channel;

      channel.bind(MIRroring_EVENT, (data: MirrorState) => {
        setMirrorState(data);
      });

      channel.bind(ATTENDANCE_EVENT, (members: ChoirMember[]) => {
        setOnlineMembers(members);
      });

      setConnected(true);
    } catch (error) {
      console.error("Failed to connect to Pusher:", error);
      setConnected(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (channelRef.current) {
      const pusher = getPusherClient();
      pusher.unsubscribe(CHOIR_CHANNEL);
      channelRef.current = null;
    }
    disconnectPusher();
    setConnected(false);
  }, []);

  const sendMirrorUpdate = useCallback(
    (data: MirrorState) => {
      if (channelRef.current) {
        channelRef.current.trigger(MIRroring_EVENT, data);
      }
    },
    []
  );

  const sendAnnotation = useCallback((data: unknown) => {
    if (channelRef.current) {
      channelRef.current.trigger(ANNOTATION_EVENT, data);
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connected,
    onlineMembers,
    mirrorState,
    connect,
    disconnect,
    sendMirrorUpdate,
    sendAnnotation,
  };
}
