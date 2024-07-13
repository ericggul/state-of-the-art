"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const Embd0 = dynamic(() => import("@/foundations/test/0-embeddings/0"));
const Embd1 = dynamic(() => import("@/foundations/test/0-embeddings/1"));
const Embd11 = dynamic(() => import("@/foundations/test/0-embeddings/1/1-1"));
const Embd12 = dynamic(() => import("@/foundations/test/0-embeddings/1/1-2"));
const Embd13 = dynamic(() => import("@/foundations/test/0-embeddings/1/1-3"));

const Embd2 = dynamic(() => import("@/foundations/test/0-embeddings/2"));

const DEFAULT_TEXT = "Is AI the brightness for the future of humanity? Or is it the darkness?";

export default function NNPage() {
  const { idx } = useParams();

  return (
    <>
      {idx == "0" && <Embd0 text={DEFAULT_TEXT} />}
      {idx == "1" && <Embd1 text={DEFAULT_TEXT} />}
      {idx == "1-1" && <Embd11 text={DEFAULT_TEXT} />}
      {idx == "1-2" && <Embd12 text={DEFAULT_TEXT} />}
      {idx == "1-3" && <Embd13 />}
      {idx == "2" && <Embd2 text={DEFAULT_TEXT} />}
    </>
  );
}
