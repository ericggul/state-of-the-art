import React, { useMemo } from "react";
import * as S from "../components/styles";
import usePosCalc from "./usePosCalc";
import useBezierParams from "./useBezierParams";
import useStore from "@/components/backend/store";
import { useVisualization } from "../shared/hooks/useVisualization";
import { useAnimationState } from "../shared/hooks/useAnimationState";
import { TokensRenderer } from "../shared/components/TokensRenderer";
import { createBezierPathV3 } from "../shared/utils/createPath";
import { usePathsBezier, usePathsRadial } from "../shared/hooks/usePaths";
import useComputeSimilarity from "../shared/utils/useComputeSimilarity";
import { createRadialPath } from "../shared/utils/createPath";

function SingleRandom({ range, visible, timeUnit }) {
  const {
    isblack,
    inputEmbeddings: newInputEmbeddings,
    outputEmbeddings: newOutputEmbeddings,
    subLevel,
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
    xRange,
    yRange,
    visible,
    isAnimating,
    timeUnit,
    subLevel
  );

  // Compute similarity matrices for input and output tokens
  const inputSimilarityMatrix = useComputeSimilarity({
    newEmbeddings: newInputEmbeddings,
  });
  const outputSimilarityMatrix = useComputeSimilarity({
    newEmbeddings: newOutputEmbeddings,
  });

  // Create radial paths for input tokens
  const inputRadialPaths = usePathsRadial({
    tokens: inputTokens,
    similarityMatrix: inputSimilarityMatrix,
    wordPosCalc: inputPosCalc.wordPosCalc,
    yMargin: inputPosCalc.yMargin,
    isblack,
    createRadialPath,
    similarityThreshold: 0.2,
    strokeWidthMultiplier: 2,
    type: "input",
    show: !isAnimating,
  });

  // Create radial paths for output tokens
  const outputRadialPaths = usePathsRadial({
    tokens: outputTokens,
    similarityMatrix: outputSimilarityMatrix,
    wordPosCalc: outputPosCalc.wordPosCalc,
    yMargin: outputPosCalc.yMargin,
    isblack,
    createRadialPath,
    similarityThreshold: 0.2,
    strokeWidthMultiplier: 2,
    type: "output",
    show: !isAnimating,
  });

  // Existing Bezier paths between input and output tokens
  const bezierPaths = usePathsBezier({
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

  // Combine all paths
  const paths = useMemo(
    () => [...inputRadialPaths, ...outputRadialPaths, ...bezierPaths],
    [inputRadialPaths, outputRadialPaths, bezierPaths]
  );

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
