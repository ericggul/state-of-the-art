import * as S from "./styles";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import useResize from "@/utils/hooks/useResize";

export default function Layer3({ newResponse }) {
  const logProbs = useMemo(() => {
    if (!newResponse) return [];

    const tokens = tokenizeKorean(newResponse.message.content);
    const topLogProbs = newResponse.logprobs.content;

    // Aggregate token log probabilities into word log probabilities
    const wordLogProbs = tokens.map((token, idx) => {
      const logProbData = topLogProbs.find((logProb) => logProb.token === token);
      return logProbData ? logProbData : { token, top_logprobs: [], logprob: null };
    });

    return wordLogProbs;
  }, [newResponse]);

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
  return percentage.toFixed(1);
}

function Token({ token, logprobs, embedding }) {
  return (
    <S.Token startswithspace={token.startsWith(" ") ? "true" : ""}>
      <p>{token}</p>
      {logprobs && (
        <>
          <S.Vector ispos={"true"}>
            <S.Inner>
              {logprobs
                .filter((_, i) => i % 2 === 0)
                .map((el) => `${el.token} (${logprobToPercentage(el.logprob)}%)`)
                .join("\n")}
            </S.Inner>
          </S.Vector>
          <S.Vector ispos={""}>
            <S.Inner>{logprobs.map((el) => `${el.token} (${logprobToPercentage(el.logprob)}%)`).join("\n")}</S.Inner>
          </S.Vector>
        </>
      )}
    </S.Token>
  );
}

// Function to tokenize Korean text by words
function tokenizeKorean(text) {
  const regex = /[\p{L}\p{N}]+|[.,!?]/gu;
  return text.match(regex) || [];
}
