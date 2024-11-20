import { useEffect, useRef } from "react";
import io from "socket.io-client";

export default function useSocketScreen({
  layerIdx = 0,
  handleNewControllerArchitectures = () => {},
  handleNewSpeech = () => {},
  handleNewMobile = () => {},
  handleNewMobileVisibility = () => {},
  handleNewMobileArchitecture = () => {},
  handleNewMobileIntro = () => {},
  handleNewScreenConversation = () => {},
}) {
  const socket = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !initialized.current) {
      socketInitializer();
      initialized.current = true;

      return () => {
        if (socket.current) {
          // Remove all listeners
          socket.current.off("new-controller-architectures");
          socket.current.off("new-mobile-init");
          socket.current.off("new-mobile-intro");
          socket.current.off("new-mobile-visibility-change");
          socket.current.off("new-mobile-speech");
          socket.current.off("new-mobile-architecture");
          socket.current.off("new-screen-conversation");
          socket.current.off("connect");

          // Disconnect
          socket.current.disconnect();
          console.log("Screen socket cleaned up");
        }
      };
    }
  }, [layerIdx]);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket.current = io();

    socket.current.on("connect", () => {
      console.log("Screen socket connected");
      socket.current.emit("screen-init", { layerIdx });

      socket.current.on(
        "new-controller-architectures",
        handleNewControllerArchitectures
      );
      socket.current.on("new-mobile-init", handleNewMobile);
      socket.current.on("new-mobile-intro", handleNewMobileIntro);
      socket.current.on(
        "new-mobile-visibility-change",
        handleNewMobileVisibility
      );
      socket.current.on("new-mobile-speech", handleNewSpeech);
      socket.current.on("new-mobile-architecture", handleNewMobileArchitecture);
      socket.current.on("new-screen-conversation", handleNewScreenConversation);
    });
  };

  return socket;
}
