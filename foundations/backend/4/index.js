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
  createBezierPathV4,
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
    level,
  } = useStore();
  const isProjector = useScreenStore((state) => state.isProjector);
  const deviceIndex = useScreenStore((state) => state.deviceIndex);
  const stage = useScreenStore((state) => state.stage);

  const { inputTokens, outputTokens, crossSimilarityMatrix } = useVisualization(
    newInputEmbeddings,
    newOutputEmbeddings
  );

  const { xRange, yRange, isAnimating } = useAnimationState({
    isblack,
    visible,
    subLevel,
    level,
  });

  const isPlural = useMemo(
    () =>
      !(
        (subLevel % 3 === 0 && isAnimating) ||
        (subLevel % 3 === 1 && !isAnimating)
      ),
    [subLevel, isAnimating]
  );

  const posCalcProps = useMemo(
    () => ({
      isAnimating,
      range,
      timeUnit,
      subLevel,
      level,
    }),
    [isAnimating, range, timeUnit, subLevel, level]
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
    timeUnit,
    isPlural
  );

  const bezierParams2 = useBezierParams(
    inputTokens,
    outputTokens,
    xRange,
    yRange,
    visible,
    isAnimating,
    timeUnit,
    isPlural,
    !isProjector
  );

  /////RADIAL PATHS
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

  /////BEZIER PATHS

  const bezierPaths = usePathsBezier({
    inputTokens,
    outputTokens,
    crossSimilarityMatrix,
    inputPosCalc,
    outputPosCalc,
    bezierParams,
    isblack,
    createBezierPath: createBezierPathV4,
    similarityThreshold: 0.2,
    strokeWidthMultiplier: 4.5,
    isPlural,
  });

  const bezierPaths2 = usePathsBezier({
    inputTokens,
    outputTokens,
    crossSimilarityMatrix,
    inputPosCalc,
    outputPosCalc,
    bezierParams: bezierParams2,
    isblack,
    createBezierPath: createBezierPathV4,
    similarityThreshold: 0.4,
    strokeWidthMultiplier: 2.5,
    isPlural,
    id: 2,
    skip: !isProjector,
  });

  const tokensOpacity = useMemo(
    () => (level >= 5 ? 0 : isblack ? 1 : 0),
    [level, isblack]
  );

  const allPaths = useMemo(() => {
    if (!visible) return [];

    const paths = [];

    paths.push(...bezierPaths);
    if (isProjector) {
      paths.push(...bezierPaths2);
    }
    if (!isAnimating) {
      paths.push(...inputRadialPaths, ...outputRadialPaths);
    }
    return paths;
  }, [
    visible,
    isAnimating,
    bezierPaths,
    bezierPaths2,
    inputRadialPaths,
    outputRadialPaths,
  ]);

  return (
    <S.Container $isblack={isblack ? "true" : undefined}>
      <div style={{ opacity: tokensOpacity }}>
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
