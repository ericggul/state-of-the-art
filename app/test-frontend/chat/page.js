"use client";

import dynamic from "next/dynamic";

const Chat = dynamic(() => import("@/foundations/test-frontend/chat"));

export default function ChatPage() {
  return (
    <>
      <Chat />
    </>
  );
}
