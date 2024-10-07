"use client";

import dynamic from "next/dynamic";

const Chat = dynamic(() => import("@/foundations/test-frontend/chat"));
const ChatStream = dynamic(() => import("@/foundations/test-frontend/chat/stream"));

import { useParams } from "next/navigation";

export default function ChatPage() {
  const { idx } = useParams();

  return (
    <>
      {idx === "0" && <Chat />}
      {idx === "1" && <ChatStream />}

      <Chat />
    </>
  );
}
