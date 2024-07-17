"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { TEST_EMBEDDINGS } from "@/foundations/test/2-plot/constant-complex";

//TSNE
const Tsne0 = dynamic(() => import("@/foundations/test/2-plot/tsne/0"));

//UMAP
const Umap0 = dynamic(() => import("@/foundations/test/2-plot/umap/0"));

//RHIZOM
const Rhizome0 = dynamic(() => import("@/foundations/test/2-plot/rhizome/0"));

export default function TsnePage() {
  const { idx } = useParams();

  return (
    <>
      {idx == "tsne-0" && <Tsne0 newEmbeddings={TEST_EMBEDDINGS} />}
      {idx == "umap-0" && <Umap0 newEmbeddings={TEST_EMBEDDINGS} />}
      {idx == "rhizome-0" && <Rhizome0 newEmbeddings={TEST_EMBEDDINGS} />}
    </>
  );
}
