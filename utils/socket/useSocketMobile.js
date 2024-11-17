import { useEffect, useRef } from "react";
import io from "socket.io-client";
import { HEARTBEAT_INTERVAL } from "@/utils/constant";

export default function useSocketMobile({ mobileId, handleNewResponse }) {
  const socket = useRef(null);
  const initialized = useRef(false);
  const heartbeatInterval = useRef(null);

  // Start heartbeat as soon as socket connects
  const startHeartbeat = () => {
    console.log("💓 Starting heartbeat for", { mobileId });
    socket.current.emit("mobile-new-heartbeat", { mobileId });
    heartbeatInterval.current = setInterval(() => {
      socket.current.emit("mobile-new-heartbeat", { mobileId });
    }, HEARTBEAT_INTERVAL);
  };

  // Stop heartbeat
  const stopHeartbeat = () => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !initialized.current) {
      socketInitializer();
      initialized.current = true;

      return () => {
        if (socket.current) {
          try {
            stopHeartbeat();
            socket.current.emit("mobile-new-visibility-change", {
              mobileId,
              isVisible: false,
              origin: "cleanup",
            });
            socket.current.off("new-controller-response");
            socket.current.off("connect");
            socket.current.off("disconnect");
            socket.current.disconnect();
          } catch (e) {
            console.error("Cleanup failed:", e);
          }
        }
      };
    }
  }, [mobileId]);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket.current = io();

    socket.current.on("connect", () => {
      socket.current.emit("mobile-init", { mobileId });
      startHeartbeat();

      socket.current.on("new-controller-response", handleNewResponse);

      socket.current.on("disconnect", () => {
        stopHeartbeat();
        socket.current.emit("mobile-new-visibility-change", {
          mobileId,
          isVisible: false,
          origin: "socket_disconnect",
        });
      });
    });
  };

  return socket;
}
