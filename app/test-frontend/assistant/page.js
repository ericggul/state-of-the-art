"use client";

import dynamic from "next/dynamic";

const Assistant = dynamic(() => import("@/foundations/test-frontend/assistant"));

export default function AssistantPage() {
  return (
    <>
      <Assistant />
    </>
  );
}
