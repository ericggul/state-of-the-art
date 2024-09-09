import * as S from "./styles";
import { useMemo, useCallback, useState, useEffect } from "react";
import useResize from "@/utils/hooks/useResize";
import useComputeSimilarity from "foundations/test/1-relation/utils/useComputeSimilarity";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

export default function Layer1({ newEmbeddings }) {
  const { embeddings, tokens } = newEmbeddings;
  const similarityMatrix = useComputeSimilarity({ newEmbeddings });

  const [windowWidth, windowHeight] = useResize();

  const wordLength = tokens.length;
  const wordInterval = useMemo(() => Math.min(0.05 * windowWidth, (windowWidth * 0.9) / wordLength), [windowWidth, wordLength]);
  const yMargin = useMemo(() => windowHeight * 0.02, [windowHeight]);

  const wordPosCalc = useCallback((idx) => [windowWidth / 2 - ((wordLength - 1) * wordInterval) / 2 + idx * wordInterval, windowHeight / 2], [wordInterval, wordLength, windowWidth, windowHeight]);

  const [targetWordIdx, setTargetWordIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTargetWordIdx((prev) => (prev + 1) % wordLength);
    }, 400);
    return () => clearInterval(interval);
  }, [wordLength]);

  const createArcPath = useCallback(
    (x1, y1, x2, y2, dir = 1) => {
      const radius = Math.abs(x2 - x1) / 2;
      const sweepFlag = dir;
      const y1Adjusted = y1 + (dir === 1 ? -1 : 1) * (x1 < x2 ? 1 : -1) * yMargin;
      const y2Adjusted = y2 + (dir === 1 ? -1 : 1) * (x1 < x2 ? 1 : -1) * yMargin;
      return `M${x1} ${y1Adjusted} A${radius} ${radius * 0.6} 0 0 ${sweepFlag} ${x2} ${y2Adjusted}`;
    },
    [yMargin]
  );

  // Memoize paths rendering to avoid redundant calculations
  const tokenPaths = useMemo(() => {
    return tokens.map((token, i) => (
      <path
        key={`arc-${i}`}
        d={createArcPath(wordPosCalc(i)[0], wordPosCalc(i)[1], wordPosCalc(targetWordIdx)[0], wordPosCalc(targetWordIdx)[1], i % 2 === 0 ? 1 : 0)}
        stroke="white"
        fill="none"
        strokeWidth={similarityMatrix[i][targetWordIdx] > 0.2 ? similarityMatrix[i][targetWordIdx] ** 2 * 4 : 0}
        opacity={i === targetWordIdx ? 0 : 1}
      />
    ));
  }, [tokens, targetWordIdx, similarityMatrix, wordPosCalc, createArcPath]);

  const interactionPaths = useMemo(() => {
    return tokens.flatMap((token, i) =>
      tokens.map((targetToken, j) =>
        i < j ? (
          <path
            key={`arc-${i}-${j}`}
            d={createArcPath(wordPosCalc(i)[0], wordPosCalc(i)[1], wordPosCalc(j)[0], wordPosCalc(j)[1], j % 2 === 0 ? 1 : 0)}
            stroke="white"
            fill="none"
            strokeWidth={similarityMatrix[i][j] ** 2 * 2}
            opacity={j === targetWordIdx || i === targetWordIdx ? 1 : 0.1}
          />
        ) : null
      )
    );
  }, [tokens, similarityMatrix, targetWordIdx, wordPosCalc, createArcPath]);

  return (
    <S.Container>
      <S.Tokens>
        {tokens.map((token, i) => (
          <Token key={i} isTarget={targetWordIdx === i} token={token} embedding={embeddings[token]} />
        ))}
      </S.Tokens>
      <S.Pic>
        {tokenPaths}
        {interactionPaths}
      </S.Pic>
    </S.Container>
  );
}

function Token({ token, embedding, isTarget }) {
  const [displayEmbeddings, setDisplayEmbeddings] = useState({
    pos: [],
    neg: [],
  });

  useEffect(() => {
    if (embedding) {
      setDisplayEmbeddings({
        pos: embedding.filter((el) => el > 0).slice(0, 25),
        neg: embedding.filter((el) => el < 0).slice(0, 25),
      });
    }
  }, [embedding]);

  // Shuffle embeddings periodically using random interval
  useRandomInterval(
    () => {
      if (embedding) {
        setDisplayEmbeddings((prev) => ({
          pos: [...prev.pos].sort(() => Math.random() - 0.5),
          neg: [...prev.neg].sort(() => Math.random() - 0.5),
        }));
      }
    },
    1000, // Use larger intervals to reduce frequent updates
    2000
  );

  return (
    <S.Token startswithspace={token.startsWith(" ") ? "true" : ""}>
      <S.Inner
        style={{
          opacity: isTarget ? 1 : 0.1,
        }}
      >
        {displayEmbeddings.pos.map((el) => el.toFixed(3)).join(" ")}
      </S.Inner>
      <p
        style={{
          margin: "1vw 0",
          fontSize: "1vw",
        }}
      >
        {token}
      </p>
      <S.Inner
        style={{
          opacity: isTarget ? 1 : 0.1,
        }}
      >
        {displayEmbeddings.neg.map((el) => el.toFixed(3)).join(" ")}
      </S.Inner>
    </S.Token>
  );
}
