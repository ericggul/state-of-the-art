import { useEffect } from "react";
import * as S from "./styles";

import useTone from "@/foundations/screen/Main/useTone";

import { TEST_EMBEDDINGS } from "@/foundations/test/1-relation/utils/constant";
import { INPUT_EMBEDDINGS, OUTPUT_EMBEDDINGS, MULTI_LAYERS_EMBEDDINGS } from "@/foundations/test/1-relation/utils/constant-conversation";

import dynamic from "next/dynamic";

const Layer0 = dynamic(() => import("@/foundations/test/0-embeddings/anim/1-1"));
const Layer1 = dynamic(() => import("@/foundations/test/1-relation/anim/0/0-1"));
const Layer2 = dynamic(() => import("@/foundations/test/1-relation/anim/2/2-1"));
const Layer3 = dynamic(() => import("@/foundations/test/3-output/anim/1-5"));

const Yakitori = dynamic(() => import("@/foundations/test/yakitori/0"));

export default function Main({ layerIdx, layersExpanded, latestPropagation, newResponse, newEmbeddings }) {
  // useTone({ layerExpanded });

  return (
    <S.Container>
      <Yakitori layerIdx={layerIdx} layersExpanded={layersExpanded} />

      {latestPropagation && latestPropagation.text && layerIdx == "0" && <Layer0 text={latestPropagation.text} newEmbeddings={newEmbeddings} />}
      {latestPropagation && latestPropagation.text && layerIdx == "1" && <Layer1 newEmbeddings={TEST_EMBEDDINGS} />}
      {latestPropagation && latestPropagation.text && layerIdx == "2" && <Layer2 newInputEmbeddings={INPUT_EMBEDDINGS} newOutputEmbeddings={OUTPUT_EMBEDDINGS} />}
      {latestPropagation && latestPropagation.text && layerIdx == "3" && <Layer3 newResponse={newResponse.generatedOutput} />}
    </S.Container>
  );
}
