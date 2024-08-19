import * as S from "./styles";
import { useMemo, useCallback, useState, useEffect } from "react";
import useResize from "@/utils/hooks/useResize";
import useComputeSimilarity from "@/foundations/test/1-relation/utils/useComputeSimilarity";

import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

const getRandom = (min, max) => Math.random() * (max - min) + min;

export default function Layer1({ newEmbeddings }) {
  const { embeddings, tokens } = newEmbeddings;
  const similarityMatrix = useComputeSimilarity({ newEmbeddings });

  const [windowWidth, windowHeight] = useResize();
  const wordLength = useMemo(() => tokens.length, [tokens]);
  const wordInterval = useMemo(() => Math.min(0.05 * windowWidth, (windowWidth * 0.9) / wordLength), [windowWidth, wordLength]);
  const yMargin = useMemo(() => windowHeight * 0.02, [windowHeight]);

  // Calculate positions around a circular arc
  const radius = useMemo(() => Math.min(windowWidth, windowHeight) * 0.4, [windowWidth, windowHeight]);
  const centerX = windowWidth / 2;
  const centerY = windowHeight / 2;

  const tokenPositions = useMemo(() => {
    const angleIncrement = (2 * Math.PI) / wordLength;
    return tokens.map((_, idx) => {
      const angle = idx * angleIncrement - Math.PI / 2; // Adjust to start from the top
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
  }, [tokens, centerX, centerY, radius, wordLength]);

  const wordPosCalc = useCallback((idx) => [tokenPositions[idx].x, tokenPositions[idx].y], [tokenPositions]);

  const [isBlack, setIsBlack] = useState(true);
  const [radialIdx, setRadialIdx] = useState(0.6);

  useRandomInterval(() => !isBlack && setRadialIdx(getRandom(0.5, 1.0)), 1, 10);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlack((b) => !b);
      setRadialIdx((i) => (i !== 0.6 ? 0.6 : getRandom(0.5, 1.0)));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <S.Container
      style={{
        background: isBlack ? "black" : "white",
        color: isBlack ? "white" : "black",
      }}
    >
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
              <SingleGroup
                i={i}
                j={j}
                yMargin={yMargin}
                radialIdx={Math.random() < 0.5 ? radialIdx : 1 - radialIdx}
                isBlack={isBlack}
                wordPosCalc={wordPosCalc}
                similarityMatrix={similarityMatrix}
                key={`${i}-${j}`}
              />
            ) : null
          )
        )}
      </S.Pic>
    </S.Container>
  );
}

function SingleGroup({ i, j, wordPosCalc, similarityMatrix, yMargin, radialIdx, isBlack }) {
  // Function to create an arc path between two points
  const createArcPath = (x1, y1, x2, y2, dir = 1) => {
    const radius = Math.abs(x2 - x1) / 2;
    const sweepFlag = dir;
    const y1Adjusted = y1 + (dir === 1 ? -1 : 1) * yMargin;
    const y2Adjusted = y2 + (dir === 1 ? -1 : 1) * yMargin;
    return `M${x1} ${y1Adjusted} A${radius} ${radius * radialIdx} 0 0 ${sweepFlag} ${x2} ${y2Adjusted}`;
  };

  const [dir, setDir] = useState(Math.random() < 0.5 ? 1 : 0);
  useRandomInterval(() => !isBlack && setDir(Math.random() < 0.5 ? 1 : 0), 10, 1000);

  return (
    <g key={`arc-group-${i}-${j}`}>
      <path
        key={`arc-${i}-${j}`}
        d={createArcPath(wordPosCalc(i)[0], wordPosCalc(i)[1], wordPosCalc(j)[0], wordPosCalc(j)[1], dir)}
        stroke={isBlack ? "white" : "black"}
        fill="none"
        strokeWidth={similarityMatrix[i][j] > 0.05 ? similarityMatrix[i][j] ** 3 * 2.0 + 0.2 : 0}
      />
    </g>
  );
}
