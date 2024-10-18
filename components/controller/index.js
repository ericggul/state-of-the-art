"use client";

import React, { useEffect, useRef } from "react";
import useChatStore from "./store";

import useSocketController from "@/utils/socket/useSocketController";

export default function Controller() {
  const socket = useSocketController({
    handleNewResponse,
    handleNewVisibilityChange,
  });

  function handleNewResponse(data) {
    console.log("new response", data);
  }

  function handleNewVisibilityChange(data) {
    console.log("new visibility change", data);
  }

  const { currentArchitectures, sendMessage } = useChatStore();
  const initialMessageSent = useRef(false);

  useEffect(() => {
    if (!initialMessageSent.current) {
      console.log("Sending initial message");
      sendMessage("");
      initialMessageSent.current = true;
    }
  }, [sendMessage]);

  useEffect(() => {
    if (socket.current && currentArchitectures.length > 0) {
      socket.current.emit("controller-new-architectures", {
        currentArchitectures,
      });
    }
  }, [socket, currentArchitectures]);

  return <></>;
}
