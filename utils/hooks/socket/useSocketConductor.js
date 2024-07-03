import { useEffect, useRef } from "react";
import io from "socket.io-client"; // Moved import inside the module

export default function useSocketConductor({ handleNewMobile, handleNewTraining }) {
  const socket = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
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
      socket.current.emit("screen-init");
      socket.current.on("new-mobile-init", handleNewMobile);
      socket.current.on("new-mobile-training", handleNewTraining);
    });
  };

  return socket;
}
