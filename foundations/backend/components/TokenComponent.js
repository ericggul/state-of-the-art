import React, { useMemo } from "react";
import * as S from "./styles";

const TokenComponent = React.memo(function TokenComponent({
  i,
  wordPosCalc,
  wordInterval,
  token,
}) {
  const style = useMemo(
    () => ({
      left: wordPosCalc(i)[0],
      top: wordPosCalc(i)[1],
      width: wordInterval,
    }),
    [i, wordPosCalc, wordInterval]
  );

  return <S.Token style={style}>{token}</S.Token>;
});

export default TokenComponent;
