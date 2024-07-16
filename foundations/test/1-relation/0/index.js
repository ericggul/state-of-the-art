import * as S from "./styles";
import { useMemo, useCallback, useState, useEffect } from "react";
import useResize from "@/utils/hooks/useResize";
import useComputeSimilarity from "../useComputeSimilarity";

export default function Layer1({ newEmbeddings }) {
  const { embeddings, tokens } = newEmbeddings;
  const similarityMatrix = useComputeSimilarity({ newEmbeddings });

  const [windowWidth, windowHeight] = useResize();
  const wordLength = useMemo(() => tokens.length, [tokens]);
  const wordInterval = useMemo(() => Math.min(0.05 * windowWidth, (windowWidth * 0.9) / wordLength), [windowWidth, wordLength]);
  const verticalInterval = useMemo(() => windowHeight * 0.02, [windowHeight]);

  const wordPosCalc = useCallback((idx) => [windowWidth / 2 - ((wordLength - 1) * wordInterval) / 2 + idx * wordInterval, windowHeight / 2], [wordInterval, wordLength]);

  const [targetWordIdx, setTargetWordIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTargetWordIdx((prev) => (prev + 1) % wordLength);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Function to create an arc path between two points
  const createArcPath = (x1, y1, x2, y2, dir = 1) => {
    const radius = Math.abs(x2 - x1) / 2;
    const sweepFlag = dir;
    const y1Adjusted = y1 + (dir === 1 ? -1 : 1) * verticalInterval;
    const y2Adjusted = y2 + (dir === 1 ? -1 : 1) * verticalInterval;
    return `M${x1} ${y1Adjusted} A${radius} ${radius * 0.6} 0 0 ${sweepFlag} ${x2} ${y2Adjusted}`;
  };

  // // Function to create a cubic Bezier path between two points
  // const createArcPath = (x1, y1, x2, y2) => {
  //   const controlPointX1 = x1 + (x2 - x1) / 4;
  //   const controlPointY1 = y1 - verticalInterval * 10; // Increased height of the arc
  //   const controlPointX2 = x2 - (x2 - x1) / 4;
  //   const controlPointY2 = y2 - verticalInterval * 10; // Increased height of the arc

  //   return `M${x1},${y1} C${controlPointX1},${controlPointY1} ${controlPointX2},${controlPointY2} ${x2},${y2}`;
  // };

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
              <path
                key={`arc-${i}-${j}`}
                d={createArcPath(wordPosCalc(i)[0], wordPosCalc(i)[1], wordPosCalc(j)[0], wordPosCalc(j)[1], j % 2 === 0 ? 1 : 0)}
                stroke="white"
                fill="none"
                strokeWidth={similarityMatrix[i][j] > 0.2 ? similarityMatrix[i][j] ** 2 * 4 : 0}
                opacity={j == targetWordIdx || i == targetWordIdx ? 1 : 0.1}

                //end circular
              />
            ) : null
          )
        )}
      </S.Pic>
    </S.Container>
  );
}
