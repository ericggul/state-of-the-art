import { useEffect } from "react";
import * as S from "./styles";

import useTone from "@/foundations/screen/Main/useTone";

import dynamic from "next/dynamic";

const Layer0 = dynamic(() => import("@/foundations/test/0-embeddings/1"));
const Layer3 = dynamic(() => import("@/foundations/test/3-logprobs/0"));

export default function Main({ layerIdx, layerExpanded, latestPropagation, newData }) {
  useTone({ layerExpanded });

  return (
    <S.Container>
      Main
      <p
        style={{
          opacity: layerExpanded ? 1 : 0,
        }}
      >
        This layer is a convolution layer.
        <br />
        This layer is currently expanded.
      </p>
      {latestPropagation && latestPropagation.text && layerIdx != "3" && <Layer0 text={latestPropagation.text} />}
      {latestPropagation && latestPropagation.text && layerIdx == "3" && <Layer3 text={latestPropagation.text} newData={newData} />}
    </S.Container>
  );
}
