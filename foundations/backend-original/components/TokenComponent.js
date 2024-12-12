import React, { useMemo } from "react";
import * as S from "./styles";

const TokenComponent = React.memo(function TokenComponent({
  i,
  wordPosCalc,
  wordInterval,
  token,
  highlightIdx = null,
}) {
  const style = useMemo(
    () => ({
      left: wordPosCalc(i)[0],
      top: wordPosCalc(i)[1],
      width: wordInterval,
      opacity: highlightIdx === null || highlightIdx === i ? 1 : 0.1,
    }),
    [i, wordPosCalc, wordInterval, highlightIdx]
  );

  return <S.Token style={style}>{token}</S.Token>;
});

export default TokenComponent;
