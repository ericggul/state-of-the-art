import io from "socket.io-client";

import { useEffect, useRef } from "react";

export default function useSocketInit({ handleNewMobileConnect, handleNewMobileDisconnect, handleNewVisibilityChange }) {
  const socket = useRef(null);
  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket.current = io();

    socket.current.on("connect", () => {
      socket.current.emit("on-off-screen-init");
      socket.current.on("new-on-off-mobile-connect", handleNewMobileConnect);
      socket.current.on("new-on-off-mobile-disconnect", handleNewMobileDisconnect);
      socket.current.on("new-on-off-visibility-change", handleNewVisibilityChange);
    });
  };

  return socket;
}
