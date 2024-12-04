import { useEffect, useRef } from "react";
import io from "socket.io-client";

export default function useSocketMobile({
  mobileId,
  sessionId,
  handleNewResponse,
}) {
  const socket = useRef(null);
  const initialized = useRef(false);

  console.log("sessionId", sessionId);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !initialized.current &&
      mobileId &&
      sessionId
    ) {
      socketInitializer();
      initialized.current = true;

      return () => {
        if (socket.current) {
          try {
            socket.current.emit("mobile-new-visibility-change", {
              mobileId,
              isVisible: false,
              origin: "cleanup",
            });
            socket.current.off("connect");
            socket.current.off("disconnect");
            socket.current.disconnect();
          } catch (e) {
            console.error("Cleanup failed:", e);
          }
        }
      };
    }
  }, [mobileId, sessionId]);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket.current = io();

    socket.current.on("connect", () => {
      socket.current.emit("mobile-init", { mobileId, sessionId });

      socket.current.on("disconnect", () => {
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
