import { useEffect, useRef } from "react";
import io from "socket.io-client"; // Moved import inside the module

export default function useSocketMobile({ mobileId }) {
  const socket = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("9");
      socketInitializer();
      return () => {
        if (socket.current) {
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
