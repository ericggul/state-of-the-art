"use client";

import React, { useEffect } from "react";
import TempChatUI from "@/foundations/mobile/index";
import useChatStore from "./store";

export default function Controller() {
  const { sendMessage } = useChatStore();

  useEffect(() => {
    // Send initial message when the component mounts
    console.log("12");
    sendMessage("");
  }, [sendMessage]);

  return <TempChatUI />;
}
