import { useEffect, useRef } from "react";
import io from "socket.io-client"; // Moved import inside the module

export default function useSocketMobile({
  handleNewState,
  handleNewChaos,
  handleNewArchitectures,
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
      console.log("Mobile socket connected");
      socket.current.emit("gartience-mobile-init");

      socket.current.on("new-gartience-state", handleNewState);
      socket.current.on("new-gartience-chaos", handleNewChaos);
      socket.current.on("new-gartience-architectures", handleNewArchitectures);
    });
  };

  return socket;
}
