import { useEffect, useRef } from "react";
import io from "socket.io-client"; // Moved import inside the module

export default function Mobile({ handleHelloWorld }) {
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
      socket.current.emit("mobile-init");
      socket.current.on("new-mobile-hello-world", handleHelloWorld);
    });
  };

  return socket;
}
