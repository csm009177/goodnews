import PusherClient from "pusher-js";

let pusherInstance: PusherClient | null = null;

export function getPusherClient(): PusherClient {
  if (!pusherInstance) {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap3";

    if (!key) {
      throw new Error("NEXT_PUBLIC_PUSHER_KEY is not set");
    }

    pusherInstance = new PusherClient(key, {
      cluster,
      forceTLS: true,
    });
  }

  return pusherInstance;
}

export function disconnectPusher() {
  if (pusherInstance) {
    pusherInstance.disconnect();
    pusherInstance = null;
  }
}
