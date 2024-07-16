"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { TEST_EMBEDDINGS } from "@/foundations/test/1-relation/constant";

//0: SVG
const Tsne0 = dynamic(() => import("@/foundations/test/2-tsne/0"));

export default function TsnePage() {
  const { idx } = useParams();

  return <>{idx == "0" && <Tsne0 newEmbeddings={TEST_EMBEDDINGS} />}</>;
}
