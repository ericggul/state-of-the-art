import { useEffect, useRef } from "react";
import io from "socket.io-client";

export default function useSocketMobile({ mobileId }) {
  const socket = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !initialized.current) {
      socketInitializer();
      initialized.current = true;
      return () => {
        if (socket.current) {
          console.log("clean up");
          socket.current.disconnect();
        }
      };
    }
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket.current = io();

    socket.current.on("connect", () => {
      console.log("23", mobileId);
      socket.current.emit("mobile-init", { mobileId });
    });
  };

  return socket;
}
