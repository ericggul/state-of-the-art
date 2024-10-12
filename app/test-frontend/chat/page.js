"use client";

import dynamic from "next/dynamic";

const Chat = dynamic(() => import("@/foundations/mobile/vanilla-gpt"));

export default function ChatPage() {
  return (
    <>
      <Chat />
    </>
  );
}
