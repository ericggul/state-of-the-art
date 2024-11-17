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
          // Remove all listeners
          socket.current.off("new-controller-response");
          socket.current.off("connect");

          // Disconnect
          socket.current.disconnect();
          console.log("Mobile socket cleaned up");
        }
      };
    }
  }, []);

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
    });
  };

  return socket;
}
