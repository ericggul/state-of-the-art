"use client";

import dynamic from "next/dynamic";

const Embeddings = dynamic(() => import("@/foundations/test/embeddings/0"));

export default function NNPage() {
  return (
    <>
      <Embeddings />
    </>
  );
}
