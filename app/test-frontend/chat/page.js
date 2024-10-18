"use client";

import dynamic from "next/dynamic";

const Chat = dynamic(() => import("@/foundations/mobile/_old/vanilla-gpt"));

export default function ChatPage() {
  return (
    <>
      <Chat />
    </>
  );
}
