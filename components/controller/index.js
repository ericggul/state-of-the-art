"use client";

import React, { useEffect, useRef } from "react";
import useChatStore from "./store";
import useSocketController from "@/utils/socket/useSocketController";

export default function Controller() {
  const { sendMessage, messages, currentArchitectures } = useChatStore();

  const handleNewResponse = async (data) => {
    console.log("new response from mobile", data);
    await sendMessage(data.text);
  };

  function handleNewVisibilityChange(data) {
    console.log("new visibility change", data);
  }

  const socket = useSocketController({
    handleNewResponse,
    handleNewVisibilityChange,
  });

  useEffect(() => {
    const initializeChat = async () => {
      console.log("Initializing chat");
      await sendMessage("");
    };
    if (messages.length === 0) {
      initializeChat();
    }
  }, [sendMessage, messages]);

  useEffect(() => {
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
