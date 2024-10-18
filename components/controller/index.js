"use client";

import React, { useEffect, useRef } from "react";
import useChatStore from "./store";
import useSocketController from "@/utils/socket/useSocketController";

export default function Controller() {
  const { sendMessage, messages, currentArchitectures } = useChatStore();
  const chatInitializedRef = useRef(false);

  const handleNewResponse = async (data) => {
    console.log("new response from mobile", data);
    await sendMessage(data.text);
  };

  const handleNewMobileInit = async (data) => {
    console.log("new mobile init", data);
    if (!chatInitializedRef.current) {
      console.log("Initializing chat");
      chatInitializedRef.current = true;
      await sendMessage("");
      console.log("Chat initialized");
    }
  };

  function handleNewVisibilityChange(data) {
    console.log("new visibility change", data);
  }

  const socket = useSocketController({
    handleNewResponse,
    handleNewMobileInit,
    handleNewVisibilityChange,
  });

  useEffect(() => {
    console.log("Current messages:", messages);
    if (socket.current && messages.length > 0) {
      const state = useChatStore.getState();
      console.log("Emitting controller-new-response", state);
      socket.current.emit("controller-new-response", {
        currentArchitectures: state.currentArchitectures,
        messages: state.messages,
        recommendedResponses: state.recommendedResponses,
        conversationStage: state.conversationStage,
        userName: state.userName,
      });
    }
  }, [socket, messages]);

  return <></>;
}
