import { useEffect, useRef } from "react";
import io from "socket.io-client"; // Moved import inside the module

export default function useSocketController({
  handleNewResponse,
  handleNewMobileInit,
  handleNewMobileVisibility,
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
      console.log("Controller socket connected");
      socket.current.emit("controller-init");

      socket.current.on("new-mobile-response", (data) => {
        console.log("Received new-mobile-response:", data);
        handleNewResponse(data);
      });
      socket.current.on("new-mobile-init", (data) => {
        console.log("Received new-mobile-init:", data);
        handleNewMobileInit(data);
      });
      socket.current.on("new-mobile-visibility-change", (data) => {
        console.log("Received new-mobile-visibility-change:", data);
        handleNewMobileVisibility(data);
      });
    });
  };

  return socket;
}
