import { useEffect, useRef } from "react";
import io from "socket.io-client";

export default function useSocketController({
  handleNewMobileInit,
  handleNewMobileVisibility,
  handleNewMobileArchitecture,
}) {
  const socket = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !initialized.current) {
      socketInitializer();
      initialized.current = true;

      return () => {
        if (socket.current) {
          try {
            // Remove all listeners
            socket.current.off("new-mobile-init");
            socket.current.off("new-mobile-visibility-change");
            socket.current.off("new-mobile-architecture");
            socket.current.off("connect");

            // Disconnect
            socket.current.disconnect();
            console.log("Controller socket cleaned up");
          } catch (e) {
            console.error("Controller cleanup failed:", e);
          }
        }
      };
    }
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket.current = io();

    socket.current.on("connect", () => {
      console.log("Controller socket connected");
      socket.current.emit("controller-init");

      socket.current.on("new-mobile-init", handleNewMobileInit);
      socket.current.on("new-mobile-architecture", handleNewMobileArchitecture);
      socket.current.on(
        "new-mobile-visibility-change",
        handleNewMobileVisibility
      );
    });
  };

  return socket;
}
