import * as S from "./styles";

import { useState, useEffect, useMemo } from "react";
import useLogProbs from "../utils/useLogProbsFiltered";
import useRandomInterval from "@/utils/hooks/useRandomInterval";

import usePosCalc from "./usePosCalc";

export default function Layer3({ newResponse }) {
  const logProbs = useLogProbs({ newResponse });

  console.log(logProbs);

  const { wordPosCalc, wordInterval, verticalInterval } = usePosCalc({ tokens: logProbs.map((el) => el.token) });

  return (
    <S.Container>
      <S.Tokens>
        {logProbs.map((token, i) => (
          <Token key={i} token={token.token} logprobs={token.top_logprobs} embedding={token.top_logprobs} />
        ))}
      </S.Tokens>
    </S.Container>
  );
}

function logprobToPercentage(logprob) {
  let probability = Math.exp(logprob);
  let percentage = probability * 100;
  return percentage;
}

function Token({ token, logprobs }) {
  console.log("35", logprobs);
  const candidates = useMemo(() => logprobs, [logprobs]);

  const splitNumber = useMemo(() => (candidates.length > 0 ? Math.floor(candidates.length / 2) : 0), [candidates]);

  return (
    <S.Token>
      {candidates.slice(0, splitNumber).map((candidate, i) => (
        <Candidate idx={i - splitNumber} token={candidate.token} key={i} />
      ))}
      <Candidate token={token} idx={0} />
      {candidates.slice(splitNumber, candidates.length - 1).map((candidate, i) => (
        <Candidate idx={i + 1} token={candidate.token} key={i} />
      ))}
    </S.Token>
  );
}

function Candidate({ idx, token }) {
  return <S.Candidate isfocus={"true"}>{token}</S.Candidate>;
}
