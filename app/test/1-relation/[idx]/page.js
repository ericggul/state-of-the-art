"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { TEST_EMBEDDINGS } from "@/foundations/test/1-relation/constant";

const Relation0 = dynamic(() => import("@/foundations/test/1-relation/0"));

export default function MatrixPage() {
  const { idx } = useParams();

  return <>{idx == "0" && <Relation0 newEmbeddings={TEST_EMBEDDINGS} />}</>;
}
