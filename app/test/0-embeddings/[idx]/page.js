"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const Embd0 = dynamic(() => import("@/foundations/test/0-embeddings/0"));

///CURRENTLY WORKING: 1
const Embd1 = dynamic(() => import("@/foundations/test/0-embeddings/1"));
const Embd11 = dynamic(() => import("@/foundations/test/0-embeddings/1/1-1"));
const Embd12 = dynamic(() => import("@/foundations/test/0-embeddings/1/1-2"));
const Embd13 = dynamic(() => import("@/foundations/test/0-embeddings/1/1-3"));
const Embd14 = dynamic(() => import("@/foundations/test/0-embeddings/1/1-4"));
const Embd15 = dynamic(() => import("@/foundations/test/0-embeddings/1/1-5"));
const Embd16 = dynamic(() => import("@/foundations/test/0-embeddings/1/1-6"));
const Embd17 = dynamic(() => import("@/foundations/test/0-embeddings/1/1-7"));
const Embd18 = dynamic(() => import("@/foundations/test/0-embeddings/1/1-8"));
const Embd19 = dynamic(() => import("@/foundations/test/0-embeddings/1/1-9"));
const Embd110 = dynamic(() => import("@/foundations/test/0-embeddings/1/1-10"));

const Embd2 = dynamic(() => import("@/foundations/test/0-embeddings/2"));
const Embd21 = dynamic(() => import("@/foundations/test/0-embeddings/2/2-1"));

//ANIMS
const EmbdAnim11 = dynamic(() => import("@/foundations/test/0-embeddings/anim/1-1"));
const EmbdAnim12 = dynamic(() => import("@/foundations/test/0-embeddings/anim/1-2"));
const EmbdAnim13 = dynamic(() => import("@/foundations/test/0-embeddings/anim/1-3"));
const EmbdAnim14 = dynamic(() => import("@/foundations/test/0-embeddings/anim/1-4"));

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
      {idx == "1-4" && <Embd14 />}
      {idx == "1-5" && <Embd15 />}
      {idx == "1-6" && <Embd16 />}
      {idx == "1-7" && <Embd17 />}
      {idx == "1-8" && <Embd18 />}
      {idx == "1-9" && <Embd19 />}
      {idx == "1-10" && <Embd110 />}

      {idx == "2" && <Embd2 text={DEFAULT_TEXT} />}
      {idx == "2-1" && <Embd21 text={DEFAULT_TEXT} />}

      {idx == "anim-1-1" && <EmbdAnim11 />}
      {idx == "anim-1-2" && <EmbdAnim12 />}
      {idx == "anim-1-3" && <EmbdAnim13 />}
      {idx == "anim-1-4" && <EmbdAnim14 />}
    </>
  );
}
