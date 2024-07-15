import { useEffect } from "react";
import * as S from "./styles";

import useTone from "@/foundations/screen/Main/useTone";

import dynamic from "next/dynamic";

const Layer0 = dynamic(() => import("@/foundations/test/0-embeddings/1"));
const Layer1 = dynamic(() => import("@/foundations/test/1-matrix/0"));
const Layer3 = dynamic(() => import("@/foundations/test/3-logprobs/0"));

const FC3D2 = dynamic(() => import("@/foundations/test/fc-3d/2"));

export default function Main({ layerIdx, layersExpanded, latestPropagation, newResponse, newEmbeddings }) {
  // useTone({ layerExpanded });

  return (
    <S.Container>
      <FC3D2 layerIdx={layerIdx} layersExpanded={layersExpanded} />

      {latestPropagation && latestPropagation.text && layerIdx == "0" && <Layer0 text={latestPropagation.text} newEmbeddings={newEmbeddings} />}
      {latestPropagation && latestPropagation.text && layerIdx == "1" && <Layer1 newEmbeddings={newEmbeddings} />}
      {latestPropagation && latestPropagation.text && layerIdx == "3" && <Layer3 text={latestPropagation.text} newResponse={newResponse} />}
    </S.Container>
  );
}
