"use client";

import React, { useEffect, useRef } from "react";
import useChatStore from "./store";

import useSocketController from "@/utils/socket/useSocketController";

export default function Controller() {
  const socket = useSocketController();

  const { currentArchitectures, sendMessage } = useChatStore();
  const initialMessageSent = useRef(false);

  console.log(currentArchitectures);

  useEffect(() => {
    if (!initialMessageSent.current) {
      console.log("Sending initial message");
      sendMessage("");
      initialMessageSent.current = true;
    }
  }, [sendMessage]);

  useEffect(() => {
    if (socket.current && currentArchitectures.length > 0) {
      socket.current.emit("controller-architectures", {
        currentArchitectures,
      });
    }
  }, [socket, currentArchitectures]);

  return <></>;
}
