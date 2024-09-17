"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { TEST_EMBEDDINGS } from "@/foundations/test/1-relation/utils/constant";

import { INPUT_EMBEDDINGS, OUTPUT_EMBEDDINGS, MULTI_LAYERS_EMBEDDINGS } from "@/foundations/test/1-relation/utils/constant-conversation";

const Embeddings00 = dynamic(() => import("@/foundations/test-backend/0-embeddings/0"));

export default function RelationPage() {
  const { idx } = useParams();

  return <>{idx == "0-0" && <Embeddings00 newEmbeddings={TEST_EMBEDDINGS} />}</>;
}
