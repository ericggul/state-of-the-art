import { useEffect, useRef } from "react";
import io from "socket.io-client"; // Moved import inside the module

export default function useSocketController({
  handleNewResponse,
  handleNewVisibilityChange,
}) {
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
      socket.current.emit("controller-init");

      socket.current.on("new-mobile-response", handleNewResponse);
      socket.current.on(
        "new-mobile-visibility-change",
        handleNewVisibilityChange
      );
    });
  };

  return socket;
}
