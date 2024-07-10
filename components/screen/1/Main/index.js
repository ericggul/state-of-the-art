import { useEffect } from "react";
import * as S from "./styles";

import useTone from "@/foundations/screen/1/Main/useTone";
import useTokenisation from "@/foundations/screen/1/Main/useTokenisation";

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
    </S.Container>
  );
}
