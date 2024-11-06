import { useEffect, useRef } from "react";
import io from "socket.io-client";

export default function useSocketScreenOrientation({
  handleNewMobileOrientation,
  handleNewMobileOrientationSpike,
}) {
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
    await fetch("/api/socket");
    socket.current = io();

    socket.current.on("connect", () => {
      socket.current.emit("screen-orientation-init");
      socket.current.on(
        "new-mobile-orientation-update",
        handleNewMobileOrientation
      );
      // socket.current.on(
      //   "new-mobile-orientation-spike",
      //   handleNewMobileOrientationSpike
      // );
    });
  };

  return socket;
}
