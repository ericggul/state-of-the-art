import { useEffect, useRef } from "react";
import io from "socket.io-client"; // Moved import inside the module

export default function useSocketScreen({
  layerIdx,
  handleNewMobile,
  handleNewLayerClicked,
  handleNewPropagation,

  handleNewResponse = () => {},
  handleNewEmbeddings = () => {},
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

      socket.current.on("new-mobile-init", handleNewMobile);
      socket.current.on("new-mobile-layer-clicked", handleNewLayerClicked);

      socket.current.on("new-conductor-propagation", handleNewPropagation);
      socket.current.on("new-conductor-response", handleNewResponse);
      socket.current.on("new-conductor-embeddings", handleNewEmbeddings);
    });
  };

  return socket;
}
