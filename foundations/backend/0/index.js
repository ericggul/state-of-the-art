import React, { useState, useEffect } from "react";
import * as S from "./styles";
import useStore from "@/components/backend/store";
import usePosCalc from "./usePosCalc";
import useComputeSimilarity from "@/foundations/backend/shared/utils/useComputeSimilarity";
import TokenComponent from "./TokenComponent";
import { useAnimationState } from "../shared/hooks/useAnimationState";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function LevelZero({ range, visible, timeUnit }) {
  const { isblack, outputEmbeddings: newEmbeddings, subLevel } = useStore();
  const { tokens, embeddings } = newEmbeddings;
  const similarityMatrix = useComputeSimilarity({ newEmbeddings });
  const posCalc = usePosCalc({ tokens });
  const [targetWordIdx, setTargetWordIdx] = useState(0);

  const { xRange, yRange, isAnimating } = useAnimationState(isblack, visible);

  // Handle target word progression
  useEffect(() => {
    const interval = setInterval(() => {
      setTargetWordIdx((prev) => prev + 1);
    }, 200);
    return () => clearInterval(interval);
  }, [tokens.length]);

  const [animState, setAnimState] = useState(0);

  useRandomInterval(() => setAnimState(getRandomInt(0, 7)), 1, 50);

  return (
    <S.Container
      isblack={isblack ? "true" : undefined}
      style={{ opacity: visible ? 1 : 0 }}
    >
      {tokens.map((token, i) => (
        <TokenComponent
          key={i}
          i={i}
          token={token}
          embedding={embeddings[token]}
          wordPosCalc={posCalc.wordPosCalc}
          wordInterval={posCalc.wordInterval}
          isTarget={i <= targetWordIdx}
          isAnimating={isAnimating}
          subLevel={subLevel}
          animState={animState}
        />
      ))}
    </S.Container>
  );
}

export default React.memo(LevelZero);
