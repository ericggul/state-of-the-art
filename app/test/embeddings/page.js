"use client";

import dynamic from "next/dynamic";

const Embeddings = dynamic(() => import("@/components/test/embeddings"));

export default function NNPage() {
  return (
    <>
      <Embeddings />
    </>
  );
}
