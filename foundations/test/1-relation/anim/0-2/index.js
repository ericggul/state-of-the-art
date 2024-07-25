import * as S from "./styles";
import { useMemo, useCallback, useState, useEffect } from "react";
import useResize from "@/utils/hooks/useResize";
import useComputeSimilarity from "@/foundations/test/1-relation/utils/useComputeSimilarity";

import useIncrementalInterval from "@/utils/hooks/intervals/useIncrementalInterval";
import useOpacityInterval from "@/utils/hooks/intervals/useOpacityInterval";

export default function Layer1({ newEmbeddings }) {
  const { embeddings, tokens } = newEmbeddings;
  const similarityMatrix = useComputeSimilarity({ newEmbeddings });

  const [windowWidth, windowHeight] = useResize();
  const wordLength = useMemo(() => tokens.length, [tokens]);
  const wordInterval = useMemo(() => Math.min(0.05 * windowWidth, (windowWidth * 0.9) / wordLength), [windowWidth, wordLength]);
  const yMargin = useMemo(() => windowHeight * 0.02, [windowHeight]);

  const wordPosCalc = useCallback((idx) => [windowWidth / 2 - ((wordLength - 1) * wordInterval) / 2 + idx * wordInterval, windowHeight / 2], [wordInterval, wordLength]);

  const [targetWordIdx, setTargetWordIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTargetWordIdx((prev) => (prev + 1) % wordLength);
    }, 400);

    return () => clearInterval(interval);
  }, [wordLength]);

  // Function to create an arc path between two points
  const createArcPath = (x1, y1, x2, y2, dir = 1) => {
    const radius = Math.abs(x2 - x1) / 2;
    const sweepFlag = dir;
    const y1Adjusted = y1 + (dir === 1 ? -1 : 1) * yMargin;
    const y2Adjusted = y2 + (dir === 1 ? -1 : 1) * yMargin;
    return `M${x1} ${y1Adjusted} A${radius} ${radius * 0.6} 0 0 ${sweepFlag} ${x2} ${y2Adjusted}`;
  };

  // Function to calculate the midpoint of the arc
  const calculateTextPoint = (x1, y1, x2, y2, dir = 1) => {
    const midX = (x1 + x2) / 2;
    const radius = Math.abs(x2 - x1) / 2;
    const midY = (y1 + y2) / 2 + (dir === 1 ? -1 : 1) * (radius * 0.6 + yMargin * 1.5);
    return [midX, midY];
  };

  return (
    <S.Container>
      {tokens.map((token, i) => (
        <S.Token
          key={i}
          style={{
            left: wordPosCalc(i)[0],
            top: wordPosCalc(i)[1],
            width: wordInterval,
          }}
        >
          {token}
        </S.Token>
      ))}
      <S.Pic>
        {tokens.map((token, i) =>
          tokens.map((targetToken, j) =>
            i < j ? (
              <SingleGroup i={i} j={j} createArcPath={createArcPath} wordPosCalc={wordPosCalc} similarityMatrix={similarityMatrix} calculateTextPoint={calculateTextPoint} key={`${i}-${j}`} />
            ) : null
          )
        )}
      </S.Pic>
    </S.Container>
  );
}

function SingleGroup({ i, j, createArcPath, wordPosCalc, similarityMatrix, calculateTextPoint }) {
  // const [opacity, setOpacity] = useState(0.1);
  // useIncrementalInterval(() => setOpacity((s) => 1 - s), 5, 10);

  const opacity = useOpacityInterval();

  return (
    <g key={`arc-group-${i}-${j}`} opacity={opacity}>
      <path
        key={`arc-${i}-${j}`}
        d={createArcPath(wordPosCalc(i)[0], wordPosCalc(i)[1], wordPosCalc(j)[0], wordPosCalc(j)[1], j % 2 === 0 ? 1 : 0)}
        stroke="white"
        fill="none"
        strokeWidth={similarityMatrix[i][j] > 0.2 ? similarityMatrix[i][j] ** 2 * 4 : 0}
      />
      {similarityMatrix[i][j] > 0.2 && (
        <text
          x={calculateTextPoint(wordPosCalc(i)[0], wordPosCalc(i)[1], wordPosCalc(j)[0], wordPosCalc(j)[1], j % 2 === 0 ? 1 : 0)[0]}
          y={calculateTextPoint(wordPosCalc(i)[0], wordPosCalc(i)[1], wordPosCalc(j)[0], wordPosCalc(j)[1], j % 2 === 0 ? 1 : 0)[1]}
          fill="white"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={"1vw"}
          opacity={1 - opacity}
        >
          {similarityMatrix[i][j].toFixed(2)}
        </text>
      )}
    </g>
  );
}
