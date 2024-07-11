import * as S from "./styles";
import axios from "axios";

import { useState, useEffect, useMemo } from "react";
import useResize from "@/utils/hooks/useResize";

export default function Layer3({ newData, text }) {
  console.log(newData);
  const logProbs = useMemo(() => (newData.generatedOutput ? newData.generatedOutput.logprobs.content : []), [newData]);

  console.log(logProbs);

  return (
    <S.Container>
      <S.Tokens>{logProbs && logProbs.map((token, i) => <Token key={i} token={token.token} embedding={token.top_logprobs.map((el) => el.logprob.toFixed(2))} />)}</S.Tokens>
    </S.Container>
  );
}

function Token({ token, embedding }) {
  return (
    <S.Token startswithspace={token.startsWith(" ") ? "true" : ""}>
      <p>{token}</p>
      {embedding && (
        <>
          <S.Vector ispos={"true"}>
            <S.Inner>{embedding.join(" ")}</S.Inner>
          </S.Vector>
          {/* <S.Vector ispos={""}>
            <S.Inner>{embedding.neg.join(" ")}</S.Inner>
          </S.Vector> */}
        </>
      )}
    </S.Token>
  );
}
