"use client";

import { useEffect } from "react";
import MobileEl from "@/foundations/mobile/v1/wrapper";
import useSocketMobile from "@/utils/socket/useSocketMobile";
import useMobileStore from "./store";

export default function Mobile() {
  const {
    mobileId,
    initializeMobileId,
    setMessages,
    setRecommendedResponses,
    setCurrentArchitectures,
    setConversationStage,
    setUserName,
    setIsWaitingForResponse,
    messages,
  } = useMobileStore();

  useEffect(() => {
    initializeMobileId();
  }, [initializeMobileId]);

  const handleNewResponse = (data) => {
    console.log("New response from controller:", data);
    setMessages(data.messages);
    setRecommendedResponses(data.recommendedResponses || []);
    setCurrentArchitectures(data.currentArchitectures || []);
    setConversationStage(data.conversationStage);
    setUserName(data.userName);
    // setIsWaitingForResponse(false);
  };

  const socket = useSocketMobile({
    mobileId,
    handleNewResponse,
  });

  return (
    <>
      <MobileEl socket={socket} />
    </>
  );
}
