import * as S from "./styles";

import { useState, useEffect, useMemo } from "react";
import useLogProbs from "./useLogProbs";
import useRandomInterval from "@/utils/hooks/useRandomInterval";

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
        ? logprobs
            .filter((el) => logprobToPercentage(el.logprob) > 0.01 && el.token !== token)
            .map((el) => ({
              token: el.token,
              percentage: logprobToPercentage(el.logprob),
            }))
        : [],
    [logprobs]
  );

  const splitNumber = useMemo(() => (candidates.length > 0 ? Math.floor(candidates.length / 2) : 0), [candidates]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFocusCandidateIdx((prev) => (prev + 1) % candidates.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [splitNumber]);

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
  const [isfocus, setIsfocus] = useState(Math.random() < 0.5);

  useRandomInterval(
    () => {
      setIsfocus((prev) => !prev);
    },
    1000,
    1500
  );

  return <S.Candidate isfocus={idx == 0 || isfocus ? "true" : undefined}>{token}</S.Candidate>;
}
