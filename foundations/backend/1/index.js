import React, { useState, useEffect } from "react";
import * as S from "./styles";
import useStore from "@/components/backend/store";
import usePosCalc from "./usePosCalc";
import useComputeSimilarity from "@/foundations/backend/shared/utils/useComputeSimilarity";
import { createArcPath } from "../shared/utils/createPath";
import { usePathsV1 } from "../shared/hooks/usePaths";
import TokenComponent from "./TokenComponent";
import { useAnimationState } from "../shared/hooks/useAnimationState";

function LevelOne({ range, visible, timeUnit }) {
  const { isblack, outputEmbeddings: newEmbeddings } = useStore();
  const { tokens, embeddings } = newEmbeddings;
  const similarityMatrix = useComputeSimilarity({ newEmbeddings });
  const posCalc = usePosCalc({ tokens });
  const [targetWordIdx, setTargetWordIdx] = useState(0);

  const { xRange, yRange, isAnimating } = useAnimationState(isblack, visible);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setTargetWordIdx((prev) => (prev + 1) % tokens.length);
    }, 400);
    return () => clearInterval(interval);
  }, [tokens.length, isAnimating]);

  const paths = usePathsV1({
    tokens,
    similarityMatrix,
    wordPosCalc: posCalc.wordPosCalc,
    yMargin: posCalc.yMargin,
    isblack,
    createArcPath,
    targetWordIdx,
    isAnimating,
    showNumbers: true,
  });

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
          isTarget={i === targetWordIdx}
          isAnimating={isAnimating}
        />
      ))}

      <S.Pic>{paths}</S.Pic>
    </S.Container>
  );
}

export default React.memo(LevelOne);
