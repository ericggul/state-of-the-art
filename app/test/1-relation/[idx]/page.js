"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { TEST_EMBEDDINGS } from "@/foundations/test/1-relation/constant";

//0: SVG
const Relation0 = dynamic(() => import("@/foundations/test/1-relation/0"));
const Relation01 = dynamic(() => import("@/foundations/test/1-relation/0/0-1"));
const Relation02 = dynamic(() => import("@/foundations/test/1-relation/0/0-2"));
const Relation03 = dynamic(() => import("@/foundations/test/1-relation/0/0-3"));

//1: D3
const Relation1 = dynamic(() => import("@/foundations/test/1-relation/1"));

export default function MatrixPage() {
  const { idx } = useParams();

  return (
    <>
      {idx == "0" && <Relation0 newEmbeddings={TEST_EMBEDDINGS} />}
      {idx == "0-1" && <Relation01 newEmbeddings={TEST_EMBEDDINGS} />}
      {idx == "0-2" && <Relation02 newEmbeddings={TEST_EMBEDDINGS} />}
      {idx == "0-3" && <Relation03 newEmbeddings={TEST_EMBEDDINGS} />}

      {idx == "1" && <Relation1 newEmbeddings={TEST_EMBEDDINGS} />}
    </>
  );
}
