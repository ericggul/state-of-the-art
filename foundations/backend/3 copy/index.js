import React, { useMemo } from "react";
import * as S from "../components/styles";
import usePosCalc from "./usePosCalc";
import useBezierParams from "./useBezierParams";
import useStore from "@/components/backend/store";
import { useVisualization } from "../shared/hooks/useVisualization";
import { useAnimationState } from "../shared/hooks/useAnimationState";
import { TokensRenderer } from "../shared/components/TokensRenderer";
import { createBezierPathV3 } from "../shared/utils/createPath";
import { usePathsBezier } from "../shared/hooks/usePaths";

function SingleRandom({ range, visible, timeUnit }) {
  const {
    isblack,
    inputEmbeddings: newInputEmbeddings,
    outputEmbeddings: newOutputEmbeddings,
  } = useStore();

  const { inputTokens, outputTokens, crossSimilarityMatrix } = useVisualization(
    newInputEmbeddings,
    newOutputEmbeddings
  );
  const { xRange, yRange, isAnimating } = useAnimationState(isblack, visible);

  const posCalcProps = useMemo(
    () => ({
      isAnimating,
      range,
      timeUnit,
    }),
    [isAnimating, range, timeUnit]
  );

  const inputPosCalc = usePosCalc({
    tokens: inputTokens,
    type: "input",
    ...posCalcProps,
  });

  const outputPosCalc = usePosCalc({
    tokens: outputTokens,
    type: "output",
    ...posCalcProps,
  });

  const bezierParams = useBezierParams(
    inputTokens,
    outputTokens,
    xRange,
    yRange,
    visible,
    isAnimating,
    timeUnit
  );

  const paths = usePathsBezier({
    inputTokens,
    outputTokens,
    crossSimilarityMatrix,
    inputPosCalc,
    outputPosCalc,
    bezierParams,
    isblack,
    createBezierPath: createBezierPathV3,
    similarityThreshold: 0.2,
    strokeWidthMultiplier: 4,
    isV4: false,
  });

  return (
    <S.Container
      isblack={isblack ? "true" : undefined}
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div>
        <TokensRenderer
          inputTokens={inputTokens}
          outputTokens={outputTokens}
          inputPosCalc={inputPosCalc}
          outputPosCalc={outputPosCalc}
        />
      </div>

      <S.Pic>{paths}</S.Pic>
    </S.Container>
  );
}

export default React.memo(SingleRandom);
