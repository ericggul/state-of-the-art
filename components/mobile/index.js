"use client";

import { useEffect } from "react";
import MobileEl from "@/foundations/mobile/wrapper";
import useSocketMobile from "@/utils/socket/useSocketMobile";
import useMobileStore from "./store";

export default function Mobile() {
  const {
    setMessages,
    setRecommendedResponses,
    setCurrentArchitectures,
    setConversationStage,
    setUserName,
    setIsWaitingForResponse,
    messages,
  } = useMobileStore();

  const handleNewResponse = (data) => {
    console.log("New response from controller:", data);
    setMessages(data.messages);
    setRecommendedResponses(data.recommendedResponses || []);
    setCurrentArchitectures(data.currentArchitectures || []);
    setConversationStage(data.conversationStage);
    setUserName(data.userName);
    setIsWaitingForResponse(false);
  };

  const socket = useSocketMobile({
    mobileId: "1",
    handleNewResponse,
  });

  useEffect(() => {
    console.log("Current mobile messages:", messages);
  }, [messages]);

  return (
    <>
      <MobileEl socket={socket} />
    </>
  );
}
