import { useEffect, useRef } from "react";
import io from "socket.io-client";

export default function useSocketMobileOrientation({ mobileId }) {
  const socket = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !initialized.current) {
      socketInitializer();
      initialized.current = true;
      return () => {
        if (socket.current) {
          socket.current.disconnect();
        }
      };
    }
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket-orientation");
    socket.current = io();

    socket.current.on("connect", () => {
      socket.current.emit("mobile-orientation-init", { mobileId });
    });
  };

  return socket;
}
