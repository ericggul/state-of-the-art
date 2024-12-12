import React, { useState, useEffect, useMemo } from "react";
import * as S from "./styles";
import useStore from "@/components/backend/store";
import useScreenStore from "@/components/screen/store";
import usePosCalc from "./usePosCalc";
import useComputeSimilarity from "@/foundations/backend/shared/utils/useComputeSimilarity";
import { createArcPath } from "../shared/utils/createPath";
import { usePathsV1 } from "../shared/hooks/usePaths";
import TokenComponent from "./TokenComponent";
import * as CONST from "@/utils/constant";

function LevelOne({ visible }) {
  const {
    isblack,
    outputEmbeddings: { tokens, embeddings },
    subLevel,
  } = useStore();
  const stage = useScreenStore((state) => state.stage);

  const similarityMatrix = useComputeSimilarity({
    newEmbeddings: { tokens, embeddings },
  });
  const { wordPosCalc, yMargin } = usePosCalc({ tokens });
  const [targetWordIdx, setTargetWordIdx] = useState(0);
  const isAnimating = useMemo(() => isblack && visible, [isblack, visible]);

  const ANIM_INTERVAL = useMemo(
    () => [300, 120, 100][subLevel] || 120,
    [subLevel]
  );

  // Combined reset and animation effect
  useEffect(() => {
    setTargetWordIdx(0);
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setTargetWordIdx((prev) => (prev + 1) % tokens.length);
    }, ANIM_INTERVAL);

    return () => clearInterval(interval);
  }, [isAnimating, tokens.length, ANIM_INTERVAL, subLevel]);

  const paths = usePathsV1({
    tokens,
    similarityMatrix,
    wordPosCalc,
    yMargin,
    isblack,
    createArcPath,
    targetWordIdx,
    isAnimating,
    subLevel,
  });

  const tokenComponents = useMemo(
    () =>
      tokens.map((token, i) => (
        <TokenComponent
          key={i}
          token={token}
          embedding={embeddings[token]}
          i={i}
          wordPosCalc={wordPosCalc}
          isTarget={i === targetWordIdx}
          isAnimating={isAnimating}
          animInterval={ANIM_INTERVAL}
          subLevel={subLevel}
        />
      )),
    [
      tokens,
      embeddings,
      wordPosCalc,
      targetWordIdx,
      isAnimating,
      ANIM_INTERVAL,
      subLevel,
    ]
  );

  return (
    <S.Container
      $isblack={isblack}
      style={{ opacity: visible ? 1 : 0 }}
      // $isTransparent={stage !== "Backend"}
      $isTransparent={false}
    >
      {tokenComponents}
      <S.Pic $animInterval={ANIM_INTERVAL} $isAnimating={isAnimating}>
        {paths}
      </S.Pic>
    </S.Container>
  );
}

export default React.memo(LevelOne);
