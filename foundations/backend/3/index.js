import React, { useMemo, useCallback } from "react";
import * as S from "../components/styles";
import usePosCalc from "./usePosCalc";
import useBezierParams from "./useBezierParams";
import useStore from "@/components/backend/store";
import { useVisualization } from "../shared/hooks/useVisualization";
import { useAnimationState } from "../shared/hooks/useAnimationState";
import { TokensRenderer } from "../shared/components/TokensRenderer";

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

  const createBezierPath = useCallback(
    (x1, y1, x2, y2, bezierParam) => {
      if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) return "";

      const controlX1 = x1 + (x2 - x1) * bezierParam.controlX1Factor;
      const controlY1 = y1 + inputPosCalc.yMargin * bezierParam.controlY1Factor;
      const controlX2 = x1 + (x2 - x1) * bezierParam.controlX2Factor;
      const controlY2 =
        y2 - outputPosCalc.yMargin * bezierParam.controlY2Factor;

      return `M${x1},${
        y1 + inputPosCalc.yMargin
      } C${controlX1},${controlY1} ${controlX2},${controlY2} ${x2},${
        y2 - outputPosCalc.yMargin
      }`;
    },
    [inputPosCalc.yMargin, outputPosCalc.yMargin]
  );

  const paths = useMemo(() => {
    return inputTokens
      .map((_, i) =>
        outputTokens.map((_, j) => {
          const similarity = crossSimilarityMatrix[i][j];
          const [x1, y1] = inputPosCalc.wordPosCalc(i);
          const [x2, y2] = outputPosCalc.wordPosCalc(j);

          return (
            <path
              key={`arc-${i}-${j}`}
              d={createBezierPath(x1, y1, x2, y2, bezierParams)}
              stroke={isblack ? "white" : "black"}
              fill="none"
              strokeWidth={similarity > 0.2 ? Math.pow(similarity, 3) * 4 : 0}
            />
          );
        })
      )
      .flat();
  }, [
    inputTokens,
    outputTokens,
    crossSimilarityMatrix,
    inputPosCalc,
    outputPosCalc,
    createBezierPath,
    bezierParams,
    isblack,
  ]);

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
