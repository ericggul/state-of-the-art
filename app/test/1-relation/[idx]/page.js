"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { TEST_EMBEDDINGS } from "@/foundations/test/1-relation/utils/constant";

import { INPUT_EMBEDDINGS, OUTPUT_EMBEDDINGS, MULTI_LAYERS_EMBEDDINGS } from "@/foundations/test/1-relation/utils/constant-conversation";

//0: SVG
const Relation0 = dynamic(() => import("@/foundations/test/1-relation/0"));
const Relation01 = dynamic(() => import("@/foundations/test/1-relation/0/0-1"));
const Relation02 = dynamic(() => import("@/foundations/test/1-relation/0/0-2"));
const Relation021 = dynamic(() => import("@/foundations/test/1-relation/0/0-2/0-2-1"));
const Relation03 = dynamic(() => import("@/foundations/test/1-relation/0/0-3"));
const Relation04 = dynamic(() => import("@/foundations/test/1-relation/0/0-4"));

//1: D3
const Relation1 = dynamic(() => import("@/foundations/test/1-relation/1"));

//2: Input-Output Structure
const Relation2 = dynamic(() => import("@/foundations/test/1-relation/2"));
const Relation21 = dynamic(() => import("@/foundations/test/1-relation/2/2-1"));
const Relation211 = dynamic(() => import("@/foundations/test/1-relation/2/2-1/2-1-1"));

const Relation22 = dynamic(() => import("@/foundations/test/1-relation/2/2-2"));
const Relation23 = dynamic(() => import("@/foundations/test/1-relation/2/2-3"));
const Relation24 = dynamic(() => import("@/foundations/test/1-relation/2/2-4"));

//3: Multi Layer Embeddings Structure
const Relation3 = dynamic(() => import("@/foundations/test/1-relation/3"));

//ANIMS
const RelationAnim01 = dynamic(() => import("@/foundations/test/1-relation/anim/0/0-1"));
const RelationAnim02 = dynamic(() => import("@/foundations/test/1-relation/anim/0/0-2"));
const RelationAnim03 = dynamic(() => import("@/foundations/test/1-relation/anim/0/0-3"));
const RelationAnim04 = dynamic(() => import("@/foundations/test/1-relation/anim/0/0-4"));
const RelationAnim05 = dynamic(() => import("@/foundations/test/1-relation/anim/0/0-5"));

const RelationAnim11 = dynamic(() => import("@/foundations/test/1-relation/anim/1/1-1"));
const RelationAnim12 = dynamic(() => import("@/foundations/test/1-relation/anim/1/1-2"));

const RelationAnim21 = dynamic(() => import("@/foundations/test/1-relation/anim/2/2-1"));
const RelationAnim22 = dynamic(() => import("@/foundations/test/1-relation/anim/2/2-2"));
const RelationAnim23 = dynamic(() => import("@/foundations/test/1-relation/anim/2/2-3"));
const RelationAnim24 = dynamic(() => import("@/foundations/test/1-relation/anim/2/2-4"));
const RelationAnim25 = dynamic(() => import("@/foundations/test/1-relation/anim/2/2-5"));
const RelationAnim26 = dynamic(() => import("@/foundations/test/1-relation/anim/2/2-6"));
const RelationAnim27 = dynamic(() => import("@/foundations/test/1-relation/anim/2/2-7"));
const RelationAnim28 = dynamic(() => import("@/foundations/test/1-relation/anim/2/2-8"));

//RANDOM
const RelationRandom01 = dynamic(() => import("@/foundations/test/1-relation/random/0/0-1"));
const RelationRandom02 = dynamic(() => import("@/foundations/test/1-relation/random/0/0-2"));
const RelationRandom03 = dynamic(() => import("@/foundations/test/1-relation/random/0/0-3"));

const RelationRandom21 = dynamic(() => import("@/foundations/test/1-relation/random/2/2-1"));
const RelationRandom22 = dynamic(() => import("@/foundations/test/1-relation/random/2/2-2"));
const RelationRandom23 = dynamic(() => import("@/foundations/test/1-relation/random/2/2-3"));
const RelationRandom24 = dynamic(() => import("@/foundations/test/1-relation/random/2/2-4"));

export default function RelationPage() {
  const { idx } = useParams();

  return (
    <>
      {idx == "0" && <Relation0 newEmbeddings={TEST_EMBEDDINGS} />}
      {idx == "0-1" && <Relation01 newEmbeddings={TEST_EMBEDDINGS} />}
      {idx == "0-2" && <Relation02 newEmbeddings={TEST_EMBEDDINGS} />}
      {idx == "0-2-1" && <Relation021 newEmbeddings={TEST_EMBEDDINGS} />}
      {idx == "0-3" && <Relation03 newEmbeddings={TEST_EMBEDDINGS} />}
      {idx == "0-4" && <Relation04 newEmbeddings={TEST_EMBEDDINGS} />}

      {idx == "1" && <Relation1 newEmbeddings={TEST_EMBEDDINGS} />}

      {idx == "2" && <Relation2 newInputEmbeddings={INPUT_EMBEDDINGS} newOutputEmbeddings={OUTPUT_EMBEDDINGS} />}
      {idx == "2-1" && <Relation21 newInputEmbeddings={INPUT_EMBEDDINGS} newOutputEmbeddings={OUTPUT_EMBEDDINGS} />}
      {idx == "2-1-1" && <Relation211 newInputEmbeddings={INPUT_EMBEDDINGS} newOutputEmbeddings={OUTPUT_EMBEDDINGS} />}

      {idx == "2-2" && <Relation22 newInputEmbeddings={INPUT_EMBEDDINGS} newOutputEmbeddings={OUTPUT_EMBEDDINGS} />}
      {idx == "2-3" && <Relation23 newInputEmbeddings={INPUT_EMBEDDINGS} newOutputEmbeddings={OUTPUT_EMBEDDINGS} />}
      {idx == "2-4" && <Relation24 newInputEmbeddings={INPUT_EMBEDDINGS} newOutputEmbeddings={OUTPUT_EMBEDDINGS} />}

      {idx == "3" && <Relation3 newMultiEmbeddings={MULTI_LAYERS_EMBEDDINGS} />}

      {idx == "anim-0-1" && <RelationAnim01 newEmbeddings={TEST_EMBEDDINGS} />}
      {idx == "anim-0-2" && <RelationAnim02 newEmbeddings={TEST_EMBEDDINGS} />}
      {idx == "anim-0-3" && <RelationAnim03 newEmbeddings={TEST_EMBEDDINGS} />}
      {idx == "anim-0-4" && <RelationAnim04 newEmbeddings={TEST_EMBEDDINGS} />}
      {idx == "anim-0-5" && <RelationAnim05 newEmbeddings={TEST_EMBEDDINGS} />}

      {idx == "anim-1-1" && <RelationAnim11 newEmbeddings={TEST_EMBEDDINGS} />}
      {idx == "anim-1-2" && <RelationAnim12 newEmbeddings={TEST_EMBEDDINGS} />}

      {idx == "anim-2-1" && <RelationAnim21 newInputEmbeddings={INPUT_EMBEDDINGS} newOutputEmbeddings={OUTPUT_EMBEDDINGS} />}
      {idx == "anim-2-2" && <RelationAnim22 newInputEmbeddings={INPUT_EMBEDDINGS} newOutputEmbeddings={OUTPUT_EMBEDDINGS} />}
      {idx == "anim-2-3" && <RelationAnim23 newInputEmbeddings={INPUT_EMBEDDINGS} newOutputEmbeddings={OUTPUT_EMBEDDINGS} />}
      {idx == "anim-2-4" && <RelationAnim24 newInputEmbeddings={INPUT_EMBEDDINGS} newOutputEmbeddings={OUTPUT_EMBEDDINGS} />}
      {idx == "anim-2-5" && <RelationAnim25 newInputEmbeddings={INPUT_EMBEDDINGS} newOutputEmbeddings={OUTPUT_EMBEDDINGS} />}
      {idx == "anim-2-6" && <RelationAnim26 newInputEmbeddings={INPUT_EMBEDDINGS} newOutputEmbeddings={OUTPUT_EMBEDDINGS} />}
      {idx == "anim-2-7" && <RelationAnim27 newInputEmbeddings={INPUT_EMBEDDINGS} newOutputEmbeddings={OUTPUT_EMBEDDINGS} />}
      {idx == "anim-2-8" && <RelationAnim28 newInputEmbeddings={INPUT_EMBEDDINGS} newOutputEmbeddings={OUTPUT_EMBEDDINGS} />}

      {idx == "random-0-1" && <RelationRandom01 newEmbeddings={TEST_EMBEDDINGS} />}
      {idx == "random-0-2" && <RelationRandom02 newEmbeddings={TEST_EMBEDDINGS} />}
      {idx == "random-0-3" && <RelationRandom03 newEmbeddings={TEST_EMBEDDINGS} />}

      {idx == "random-2-1" && <RelationRandom21 newInputEmbeddings={INPUT_EMBEDDINGS} newOutputEmbeddings={OUTPUT_EMBEDDINGS} />}
      {idx == "random-2-2" && <RelationRandom22 newInputEmbeddings={INPUT_EMBEDDINGS} newOutputEmbeddings={OUTPUT_EMBEDDINGS} />}
      {idx == "random-2-3" && <RelationRandom23 newInputEmbeddings={INPUT_EMBEDDINGS} newOutputEmbeddings={OUTPUT_EMBEDDINGS} />}
      {idx == "random-2-4" && <RelationRandom24 newInputEmbeddings={INPUT_EMBEDDINGS} newOutputEmbeddings={OUTPUT_EMBEDDINGS} />}
    </>
  );
}
