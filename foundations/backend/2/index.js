import React, { useMemo, useCallback } from "react";
import * as S from "../components/styles";
import useStore from "@/components/backend/store";
import useComputeSimilarity from "@/foundations/backend/utils/useComputeSimilarity";
import { useBasePosCalc } from "../shared/hooks/useBasePosCalc";
import { useAnimationState } from "../shared/hooks/useAnimationState";
import { TokensRenderer } from "../shared/components/TokensRenderer";
import useRadialParams from "./useRadialParams";

function SingleRandom({ range, visible, timeUnit }) {
  const { isblack, outputEmbeddings: newEmbeddings } = useStore();
  const { tokens } = newEmbeddings;
  const similarityMatrix = useComputeSimilarity({ newEmbeddings });
  const { xRange, yRange, isAnimating } = useAnimationState(isblack, visible);

  const { wordInterval, yMargin, generateStaticPositions } = useBasePosCalc({
    tokens,
    type: "center",
  });

  const positions = useMemo(
    () => generateStaticPositions(),
    [generateStaticPositions]
  );

  const wordPosCalc = useCallback(
    (idx) => {
      const position = positions[idx];
      return position ? [position.x, position.y] : [0, 0];
    },
    [positions]
  );

  const radialIdx = useRadialParams(visible, isAnimating, timeUnit);

  const createArcPath = useCallback(
    (x1, y1, x2, y2, dir = 1) => {
      const radius = Math.abs(x2 - x1) / 2;
      const sweepFlag = dir;
      const y1Adjusted = y1 + (dir === 1 ? -1 : 1) * yMargin;
      const y2Adjusted = y2 + (dir === 1 ? -1 : 1) * yMargin;
      return `M${x1} ${y1Adjusted} A${radius} ${
        radius * radialIdx
      } 0 0 ${sweepFlag} ${x2} ${y2Adjusted}`;
    },
    [yMargin, radialIdx]
  );

  const paths = useMemo(() => {
    return tokens.flatMap((_, i) =>
      tokens
        .map((_, j) => {
          if (i >= j) return null;

          const similarity = similarityMatrix[i][j];
          if (similarity <= 0.05) return null;

          const [x1, y1] = wordPosCalc(i);
          const [x2, y2] = wordPosCalc(j);

          return (
            <path
              key={`arc-${i}-${j}`}
              d={createArcPath(x1, y1, x2, y2, i % 2)}
              stroke={isblack ? "white" : "black"}
              fill="none"
              strokeWidth={Math.pow(similarity, 3) * 2.0 + 0.2}
            />
          );
        })
        .filter(Boolean)
    );
  }, [tokens, similarityMatrix, wordPosCalc, createArcPath, isblack]);

  const posCalc = {
    wordPosCalc,
    wordInterval,
    yMargin,
  };

  return (
    <S.Container
      isblack={isblack ? "true" : undefined}
      style={{ opacity: visible ? 1 : 0 }}
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
