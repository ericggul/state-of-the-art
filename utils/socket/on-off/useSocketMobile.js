import io from "socket.io-client";
import { useEffect, useRef } from "react";

//IMPORTANT: This logic presents the device unload logic, when user is about to leave the site

export default function useSocketInit({ mobileId }) {
  const socket = useRef(null);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socket.current = io();

      socket.current.on("connect", () => {
        socket.current.emit("on-off-mobile-init", { mobileId });
      });
    };

    socketInitializer();

    const handleBeforeUnload = () => {
      if (socket.current) {
        socket.current.emit("on-off-mobile-disconnect", { mobileId });
        socket.current.disconnect();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (socket.current) {
        socket.current.emit("on-off-mobile-disconnect", { mobileId });
        socket.current.disconnect();
      }
    };
  }, [mobileId]);

  return socket;
}
