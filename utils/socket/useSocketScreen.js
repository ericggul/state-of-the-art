import { useEffect, useRef } from "react";
import io from "socket.io-client"; // Moved import inside the module

export default function useSocketScreen({
  layerIdx = 0,
  handleNewControllerArchitectures = () => {},
  handleNewSpeech = () => {},
  handleNewMobile = () => {},
  handleNewMobileVisibility = () => {},
  handleNewMobileArchitecture = () => {},
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
  }, [layerIdx]);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket.current = io();

    socket.current.on("connect", () => {
      socket.current.emit("screen-init", { layerIdx });

      socket.current.on(
        "new-controller-architectures",
        handleNewControllerArchitectures
      );
      ////////////////////////////////////////////////////////////////

      socket.current.on("new-mobile-init", handleNewMobile);
      socket.current.on(
        "new-mobile-visibility-change",
        handleNewMobileVisibility
      );

      ////////////////////////////////////////////////////////////////

      socket.current.on("new-mobile-speech", handleNewSpeech);

      socket.current.on("new-mobile-architecture", handleNewMobileArchitecture);
    });
  };

  return socket;
}
