import React, { useMemo } from "react";
import * as S from "../components/styles";
import usePosCalc from "./usePosCalc";
import useBezierParams from "./useBezierParams";
import useStore from "@/components/backend/store";
import useScreenStore from "@/components/screen/store";
import { useVisualization } from "../shared/hooks/useVisualization";
import { useAnimationState } from "./useAnimationState";
import { TokensRenderer } from "../shared/components/TokensRenderer";
import {
  createBezierPathV3,
  createRadialPath,
} from "../shared/utils/createPath";
import { usePathsBezier, usePathsRadial } from "../shared/hooks/usePaths";
import useComputeSimilarity from "../shared/utils/useComputeSimilarity";
import * as CONST from "@/utils/constant";

function SingleRandom({ range, visible, timeUnit }) {
  const {
    isblack,
    inputEmbeddings: newInputEmbeddings,
    outputEmbeddings: newOutputEmbeddings,
    subLevel,
  } = useStore();

  const iteration = useScreenStore((state) => state.iteration);

  const { inputTokens, outputTokens, crossSimilarityMatrix } = useVisualization(
    newInputEmbeddings,
    newOutputEmbeddings
  );
  const { xRange, yRange, isAnimating } = useAnimationState(
    isblack,
    visible,
    subLevel
  );

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
    isPlural: false,
  });

  // Batch path updates
  const allPaths = useMemo(() => {
    if (!visible) return [];

    const paths = [];

    paths.push(...bezierPaths);
    if (!isAnimating) {
      paths.push(...inputRadialPaths, ...outputRadialPaths);
    }
    return paths;
  }, [visible, isAnimating, bezierPaths, inputRadialPaths, outputRadialPaths]);

  return (
    <S.Container
      $isblack={isblack ? "true" : undefined}
      style={{ opacity: visible ? 1 : 0 }}
      $isTransparent={iteration >= CONST.MIX_BACKEND_ITERATION}
    >
      <div
        style={{
          opacity: isblack ? 1 : 0,
          transition: "opacity 0.5s",
          transitionDelay: ".1s",
        }}
      >
        <TokensRenderer
          inputTokens={inputTokens}
          outputTokens={outputTokens}
          inputPosCalc={inputPosCalc}
          outputPosCalc={outputPosCalc}
        />
      </div>

      <S.Pic>{allPaths}</S.Pic>
    </S.Container>
  );
}

export default React.memo(SingleRandom);
