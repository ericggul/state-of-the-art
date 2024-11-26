import React, { useState, useEffect, useMemo } from "react";
import * as S from "./styles";
import useStore from "@/components/backend/store";
import useScreenStore from "@/components/screen/store";
import usePosCalc from "./usePosCalc";
import TokenComponent from "./TokenComponent";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";
import * as CONST from "@/utils/constant";

function LevelZero({ visible }) {
  const {
    isblack,
    outputEmbeddings: { tokens, embeddings },
    subLevel,
  } = useStore();
  const stage = useScreenStore((state) => state.stage);

  const { wordPosCalc, wordInterval } = usePosCalc({ tokens });
  const [targetWordIdx, setTargetWordIdx] = useState(0);
  const [animState, setAnimState] = useState(0);
  const isAnimating = useMemo(() => isblack && visible, [isblack, visible]);

  // Handle target word progression
  useEffect(() => {
    const interval = setInterval(
      () => setTargetWordIdx((prev) => prev + 1),
      200
    );
    return () => clearInterval(interval);
  }, [tokens.length]);

  // Handle animation state
  useRandomInterval(() => setAnimState(Math.floor(Math.random() * 8)), 1, 30);

  return (
    <S.Container
      $isblack={isblack ? "true" : undefined}
      style={{ opacity: visible ? 1 : 0 }}
      $isTransparent={stage !== "Backend"}
    >
      {tokens.map((token, i) => (
        <TokenComponent
          key={i}
          i={i}
          token={token}
          embedding={embeddings[token]}
          wordPosCalc={wordPosCalc}
          wordInterval={wordInterval}
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
