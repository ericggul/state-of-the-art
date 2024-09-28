"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { TEST_EMBEDDINGS } from "@/foundations/test/1-relation/utils/constant";

import { INPUT_EMBEDDINGS, OUTPUT_EMBEDDINGS, MULTI_LAYERS_EMBEDDINGS } from "@/foundations/test/1-relation/utils/constant-conversation";

const Embeddings00 = dynamic(() => import("@/foundations/test-backend/0-embeddings/0"));
const Embeddings250 = dynamic(() => import("@/foundations/test-backend/2.5-duo/0"));
const Embeddings25Store = dynamic(() => import("@/foundations/test-backend/2.5-duo/store"));
const Embeddings25Transparent = dynamic(() => import("@/foundations/test-backend/2.5-duo/transparent"));

export default function RelationPage() {
  const { idx } = useParams();

  return (
    <>
      {idx == "0-0" && <Embeddings00 newEmbeddings={TEST_EMBEDDINGS} />}

      {idx == "2.5-0" && <Embeddings250 newInputEmbeddings={INPUT_EMBEDDINGS} newOutputEmbeddings={OUTPUT_EMBEDDINGS} />}
      {idx == "2.5-" && <Embeddings25Store newInputEmbeddings={INPUT_EMBEDDINGS} newOutputEmbeddings={OUTPUT_EMBEDDINGS} />}
      {idx == "2.5-transparent" && <Embeddings25Transparent newInputEmbeddings={INPUT_EMBEDDINGS} newOutputEmbeddings={OUTPUT_EMBEDDINGS} />}
    </>
  );
}
