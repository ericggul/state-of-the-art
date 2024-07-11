"use client";

import dynamic from "next/dynamic";

const Embeddings = dynamic(() => import("@/foundations/test/0-embeddings/0"));

export default function NNPage() {
  return (
    <>
      <Embeddings tokens={[]} />
    </>
  );
}
