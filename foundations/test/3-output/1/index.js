import * as S from "./styles";

import { useState, useEffect, useMemo } from "react";
import useLogProbs from "../utils/useLogProbsFiltered";
import useRandomInterval from "@/utils/hooks/useRandomInterval";

import usePosCalc from "./usePosCalc";

export default function Layer3({ newResponse }) {
  const logProbs = useLogProbs({ newResponse });

  console.log(logProbs);

  const { wordPosCalc, wordInterval, verticalInterval } = usePosCalc({ logProbs, tokens: logProbs.map((el) => el.token) });

  return (
    <S.Container>
      <S.Tokens>
        {logProbs.map((token, i) => (
          <Token xIdx={i} key={i} token={token.token} logprobs={token.top_logprobs} wordPosCalc={wordPosCalc} />
        ))}
      </S.Tokens>
    </S.Container>
  );
}

function Token({ xIdx, token, logprobs, wordPosCalc }) {
  return (
    <S.Token>
      <S.Candidate
        style={{
          left: wordPosCalc(xIdx, -1)[0],
          top: wordPosCalc(xIdx, -1)[1],
        }}
      >
        {token}
      </S.Candidate>
      {logprobs.map((target, yIdx) => (
        <S.Candidate
          style={{
            left: wordPosCalc(xIdx, yIdx)[0],
            top: wordPosCalc(xIdx, yIdx)[1],
          }}
          key={yIdx}
        >
          {target.token}
        </S.Candidate>
      ))}
    </S.Token>
  );
}
