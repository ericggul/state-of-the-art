import { useEffect, useRef } from "react";
import io from "socket.io-client";

export default function useSocketScreen({
  isController = false,

  handleNewMobile = () => {},
  handleNewMobileVisibility = () => {},
  handleNewMobileArchitecture = () => {},
  handleNewMobileIntro = () => {},

  handleNewControllerInit = () => {},
  handleNewControllerVisibility = () => {},
  handleNewControllerArchitectures = () => {},
  handleNewControllerStageAndReset = () => {},
  handleNewControllerSessionId = () => {},

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

          socket.current.off("new-mobile-init");
          socket.current.off("new-mobile-intro");
          socket.current.off("new-mobile-visibility-change");
          socket.current.off("new-mobile-architecture");

          socket.current.off("new-controller-visibility-change");
          socket.current.off("new-controller-architectures");
          socket.current.off("new-controller-sessionId");
          socket.current.off("new-screen-conversation");

          socket.current.off("connect");

          // Disconnect
          socket.current.disconnect();
          console.log("Screen socket cleaned up");
        }
      };
    }
  }, [isController]);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket.current = io();

    socket.current.on("connect", () => {
      console.log("Screen socket connected");

      if (isController) {
        console.log("Screen socket emitting controller-init");
        socket.current.emit("controller-init");
      } else {
        console.log("Screen socket emitting screen-init");
        socket.current.emit("screen-init");
      }

      //MOBILE -> SCREEN
      socket.current.on("new-mobile-init", handleNewMobile);
      socket.current.on("new-mobile-intro", handleNewMobileIntro);
      socket.current.on(
        "new-mobile-visibility-change",
        handleNewMobileVisibility
      );
      socket.current.on("new-mobile-architecture", handleNewMobileArchitecture);

      //CONTROLLER -> SCREEN
      socket.current.on("new-controller-init", handleNewControllerInit);
      socket.current.on(
        "new-controller-visibility-change",
        handleNewControllerVisibility
      );
      socket.current.on(
        "new-controller-architectures",
        handleNewControllerArchitectures
      );
      socket.current.on(
        "new-controller-stage-and-reset",
        handleNewControllerStageAndReset
      );
      socket.current.on(
        "new-controller-sessionId",
        handleNewControllerSessionId
      );

      ////SCREEN -> SCREEN
      socket.current.on("new-screen-conversation", handleNewScreenConversation);
    });
  };

  return socket;
}
