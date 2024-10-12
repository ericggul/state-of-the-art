"use client";

import React, { useEffect, useRef } from "react";
import TempChatUI from "@/foundations/mobile/index";
import useChatStore from "./store";

export default function Controller() {
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

  return <TempChatUI />;
}
