"use client";

import React, { useEffect, useRef } from "react";
import TempChatUI from "@/foundations/mobile/index";
import useChatStore from "./store";

export default function Controller() {
  const { sendMessage } = useChatStore();
  const initialMessageSent = useRef(false);

  useEffect(() => {
    if (!initialMessageSent.current) {
      console.log("Sending initial message");
      sendMessage("");
      initialMessageSent.current = true;
    }
  }, [sendMessage]);

  return <TempChatUI />;
}
