import React, { useState, useEffect } from "react";
import * as S from "./styles";
import useStore from "@/components/backend/store";
import usePosCalc from "./usePosCalc";
import useComputeSimilarity from "@/foundations/backend/shared/utils/useComputeSimilarity";
import { createArcPath } from "../shared/utils/createPath";
import { usePathsV1 } from "../shared/hooks/usePaths";
import TokenComponent from "./TokenComponent";
import { useAnimationState } from "../shared/hooks/useAnimationState";

function LevelOne({ visible }) {
  const {
    isblack,
    outputEmbeddings: { tokens, embeddings },
    subLevel,
  } = useStore();
  const similarityMatrix = useComputeSimilarity({
    newEmbeddings: { tokens, embeddings },
  });
  const posCalc = usePosCalc({ tokens });
  const [targetWordIdx, setTargetWordIdx] = useState(0);
  const { isAnimating } = useAnimationState(isblack, visible);

  const ANIM_INTERVAL = subLevel === 0 ? 300 : subLevel === 1 ? 200 : 100;

  // Reset targetWordIdx when subLevel changes
  useEffect(() => {
    setTargetWordIdx(0);
  }, [subLevel]);

  // Handle animation progression
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setTargetWordIdx((prev) => (prev + 1) % tokens.length);
    }, ANIM_INTERVAL);

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
    subLevel,
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
          animInterval={ANIM_INTERVAL}
          subLevel={subLevel}
        />
      ))}
      <S.Pic $animInterval={ANIM_INTERVAL}>{paths}</S.Pic>
    </S.Container>
  );
}

export default React.memo(LevelOne);
