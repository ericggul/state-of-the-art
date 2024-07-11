import { useEffect } from "react";
import * as S from "./styles";

import useTone from "@/foundations/screen/Main/useTone";
import useTokenisation from "@/foundations/screen/Main/useTokenisation";

import Layer0 from "@/foundations/test/0-embeddings/1";

export default function Main({ layerIdx, layerExpanded, latestPropagation }) {
  useTone({ layerExpanded });
  const tokens = useTokenisation({ text: latestPropagation.text || "" });
  console.log(tokens);

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
      {tokens && <Layer0 tokens={tokens} />}
    </S.Container>
  );
}
