import * as S from "./styles";

import { useState, useEffect, useMemo } from "react";
import useLogProbs from "./useLogProbs";

export default function Layer3({ newResponse }) {
  const logProbs = useLogProbs({ newResponse });

  return (
    <S.Container>
      <S.Tokens>
        {logProbs.map((token, i) => (
          <Token key={i} token={token.token} logprobs={token.top_logprobs} embedding={token.top_logprobs.map((el) => el.logprob.toFixed(2))} />
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

function Token({ token, logprobs, embedding }) {
  const [focusCandidateIdx, setFocusCandidateIdx] = useState(0);

  const candidates = useMemo(
    () =>
      logprobs
        .filter((el) => logprobToPercentage(el.logprob) > 1)
        .map((el) => ({
          token: el.token,
          percentage: logprobToPercentage(el.logprob),
        })),
    [logprobs]
  );

  return (
    <S.Token>
      <p>{token}</p>
      {candidates &&
        candidates.map((candidate, i) => (
          <S.Candidate key={i} isfocus={i === focusCandidateIdx ? "true" : "true"}>
            <p>{candidate.token}</p>
          </S.Candidate>
        ))}
    </S.Token>
  );
}
