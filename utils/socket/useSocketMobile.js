import { useEffect, useRef } from "react";
import io from "socket.io-client";

export default function useSocketMobile({ mobileId, handleNewResponse }) {
  const socket = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !initialized.current) {
      socketInitializer();
      initialized.current = true;

      return () => {
        if (socket.current) {
          try {
            // Try to notify about disconnection
            socket.current.emit("mobile-new-visibility-change", {
              mobileId,
              isVisible: false,
              origin: "cleanup",
            });

            // Remove listeners
            socket.current.off("new-controller-response");
            socket.current.off("connect");
            socket.current.off("disconnect");

            // Disconnect
            socket.current.disconnect();
            console.log("Mobile socket cleaned up");
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
      console.log("Mobile socket connected");
      socket.current.emit("mobile-init", { mobileId });

      socket.current.on("new-controller-response", (data) => {
        console.log("Received new-controller-response:", data);
        handleNewResponse(data);
      });

      socket.current.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        // Try to notify about disconnection
        try {
          socket.current.emit("mobile-new-visibility-change", {
            mobileId,
            isVisible: false,
            origin: "socket_disconnect-1",
          });
        } catch (e) {
          console.error("Disconnect notification failed:", e);
        }
      });
    });
  };

  return socket;
}
