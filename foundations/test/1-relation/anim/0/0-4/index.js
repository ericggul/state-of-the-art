import * as S from "./styles";
import { useMemo, useCallback, useState, useEffect } from "react";
import useResize from "@/utils/hooks/useResize";
import useComputeSimilarity from "@/foundations/test/1-relation/utils/useComputeSimilarity";

import useIncrementalInterval from "@/utils/hooks/intervals/useIncrementalInterval";
import useOpacityInterval from "@/utils/hooks/intervals/useOpacityInterval";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

const getRandom = (min, max) => Math.random() * (max - min) + min;

export default function Layer1({ newEmbeddings }) {
  const { embeddings, tokens } = newEmbeddings;
  const similarityMatrix = useComputeSimilarity({ newEmbeddings });

  const [windowWidth, windowHeight] = useResize();
  const wordLength = useMemo(() => tokens.length, [tokens]);
  const wordInterval = useMemo(() => Math.min(0.05 * windowWidth, (windowWidth * 0.9) / wordLength), [windowWidth, wordLength]);
  const yMargin = useMemo(() => windowHeight * 0.02, [windowHeight]);

  const wordPosCalc = useCallback((idx) => [windowWidth / 2 - ((wordLength - 1) * wordInterval) / 2 + idx * wordInterval, windowHeight / 2], [wordInterval, wordLength]);

  const [radialIdx, setRadialIdx] = useState(0.6);
  useRandomInterval(() => setRadialIdx(getRandom(0.2, 1.0)), 1, 20);

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
              <SingleGroup i={i} j={j} yMargin={yMargin} radialIdx={Math.random() < 0.5 ? radialIdx : 1 - radialIdx} wordPosCalc={wordPosCalc} similarityMatrix={similarityMatrix} key={`${i}-${j}`} />
            ) : null
          )
        )}
      </S.Pic>
    </S.Container>
  );
}

function SingleGroup({ i, j, wordPosCalc, similarityMatrix, yMargin, radialIdx }) {
  // Function to create an arc path between two points
  const createArcPath = (x1, y1, x2, y2, dir = 1) => {
    const radius = Math.abs(x2 - x1) / 2;
    const sweepFlag = dir;
    const y1Adjusted = y1 + (dir === 1 ? -1 : 1) * yMargin;
    const y2Adjusted = y2 + (dir === 1 ? -1 : 1) * yMargin;
    return `M${x1} ${y1Adjusted} A${radius} ${radius * radialIdx} 0 0 ${sweepFlag} ${x2} ${y2Adjusted}`;
  };

  // Function to calculate the midpoint of the arc
  const calculateTextPoint = (x1, y1, x2, y2, dir = 1) => {
    const midX = (x1 + x2) / 2;
    const radius = Math.abs(x2 - x1) / 2;
    const midY = (y1 + y2) / 2 + (dir === 1 ? -1 : 1) * (radius * radialIdx + yMargin * 1.5);
    return [midX, midY];
  };

  const [dir, setDir] = useState(Math.random() < 0.5 ? 1 : 0);

  useRandomInterval(() => setDir(Math.random() < 0.5 ? 1 : 0), 10, 1000);

  return (
    <g key={`arc-group-${i}-${j}`}>
      <path
        key={`arc-${i}-${j}`}
        d={createArcPath(wordPosCalc(i)[0], wordPosCalc(i)[1], wordPosCalc(j)[0], wordPosCalc(j)[1], dir)}
        stroke="white"
        fill="none"
        strokeWidth={similarityMatrix[i][j] > 0.05 ? similarityMatrix[i][j] ** 3 + 0.2 : 0}
      />
    </g>
  );
}
