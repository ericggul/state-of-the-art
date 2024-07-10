"use client";

import dynamic from "next/dynamic";

const Brain = dynamic(() => import("@/foundations/test/brain"));

export default function NNPage() {
  return (
    <>
      <Brain />
    </>
  );
}
