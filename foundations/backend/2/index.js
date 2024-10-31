import React, { useMemo, useCallback } from "react";
import * as S from "../components/styles";
import useStore from "@/components/backend/store";
import useComputeSimilarity from "@/foundations/backend/utils/useComputeSimilarity";
import { useBasePosCalc } from "../shared/hooks/useBasePosCalc";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

function SingleRandom({ range, visible, timeUnit }) {
  const { isblack, outputEmbeddings: newEmbeddings } = useStore();
  const { tokens } = newEmbeddings;
  const similarityMatrix = useComputeSimilarity({ newEmbeddings });

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

  const [radialIdx, setRadialIdx] = React.useState(0.6);
  useRandomInterval(
    () => !isblack && setRadialIdx(Math.random() * 1.2 + 0.2),
    timeUnit,
    10 * timeUnit,
    visible
  );

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

  return (
    <S.Container
      isblack={isblack ? "true" : undefined}
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div>
        {tokens.map((token, i) => {
          const [x, y] = wordPosCalc(i);
          return (
            <S.Token
              key={i}
              style={{
                left: x,
                top: y,
                width: wordInterval,
                transform: "translate(-50%, -50%)",
              }}
            >
              {token}
            </S.Token>
          );
        })}
      </div>
      <S.Pic>{paths}</S.Pic>
    </S.Container>
  );
}

export default React.memo(SingleRandom);
