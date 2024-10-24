"use client";

import dynamic from "next/dynamic";

const Chat = dynamic(() => import("@/foundations/mobile/v1/_old/vanilla-gpt"));

export default function ChatPage() {
  return (
    <>
      <Chat />
    </>
  );
}
