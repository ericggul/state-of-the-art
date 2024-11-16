import React, { useMemo } from "react";
import * as S from "../components/styles";
import usePosCalc from "./usePosCalc";
import useRadialParams from "./useRadialParams";
import useStore from "@/components/backend/store";
import useScreenStore from "@/components/screen/store";
import useComputeSimilarity from "@/foundations/backend/shared/utils/useComputeSimilarity";
import { TokensRenderer } from "../shared/components/TokensRenderer";
import { createRadialPath } from "../shared/utils/createPath";
import { usePathsV2 } from "../shared/hooks/usePaths";
import * as CONST from "@/utils/constant";

function SingleRandom({ range, visible, timeUnit }) {
  const { isblack, outputEmbeddings: newEmbeddings, subLevel } = useStore();
  const stage = useScreenStore((state) => state.stage);

  const { tokens } = newEmbeddings;
  const similarityMatrix = useComputeSimilarity({ newEmbeddings });

  const isAnimating = useMemo(() => isblack && visible, [isblack, visible]);

  const posCalc = usePosCalc({ tokens });
  const radialIdx = useRadialParams(visible, isAnimating, timeUnit, subLevel);

  const paths = usePathsV2({
    tokens,
    similarityMatrix,
    wordPosCalc: posCalc.wordPosCalc,
    yMargin: posCalc.yMargin,
    radialIdx,
    isblack,
    createRadialPath,
    isAnimating,
    subLevel,
  });

  return (
    <S.Container
      $isblack={isblack ? "true" : undefined}
      style={{ opacity: visible ? 1 : 0 }}
      $isTransparent={stage !== "Backend"}
    >
      <div
        style={{
          opacity: isblack ? 0 : 1,
        }}
      >
        <TokensRenderer
          inputTokens={[]}
          outputTokens={tokens}
          inputPosCalc={posCalc}
          outputPosCalc={posCalc}
        />
      </div>
      <S.Pic>{paths}</S.Pic>
    </S.Container>
  );
}

export default React.memo(SingleRandom);
