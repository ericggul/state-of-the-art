import * as S from "./styles";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";

export default function Layer3({ newResponse }) {
  console.log(newResponse);
  const logProbs = useMemo(() => {
    if (!newResponse) return [];

    const tokens = tokenizeKorean(newResponse.message.content);
    const topLogProbs = newResponse.logprobs.content;

    // Aggregate token log probabilities into word log probabilities
    const wordLogProbs = tokens.map((token, idx) => {
      const combinedLogProbs = topLogProbs.filter((logProb) => token.includes(logProb.token));

      console.log(combinedLogProbs);

      const aggregatedLogProbs = combinedLogProbs.reduce((acc, curr) => {
        curr.top_logprobs.forEach((el) => {
          const existing = acc.find((log) => log.token === el.token);
          if (existing) {
            existing.logprob = Math.max(existing.logprob, el.logprob);
          } else {
            acc.push(el);
          }
        });
        return acc;
      }, []);

      console.log(aggregatedLogProbs);

      return {
        token,
        top_logprobs: aggregatedLogProbs,
      };
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
      <p>{decode(token)}</p>
      {logprobs && (
        <>
          <S.Vector ispos={"true"}>
            <S.Inner>
              {logprobs
                .filter((_, i) => i % 2 === 0)
                .map((el) => `${decode(el.token)} (${logprobToPercentage(el.logprob)}%)`)
                .join("\n")}
            </S.Inner>
          </S.Vector>
          <S.Vector ispos={""}>
            <S.Inner>{logprobs.map((el) => `${decode(el.token)} (${logprobToPercentage(el.logprob)}%)`).join("\n")}</S.Inner>
          </S.Vector>
        </>
      )}
    </S.Token>
  );
}

// Function to decode UTF-8 encoded strings to Unicode characters
function decode(encodedString) {
  try {
    const hexArray = encodedString.match(/\\x[0-9A-Fa-f]{2}/g);
    if (hexArray) {
      const decodedString = hexArray.map((hex) => String.fromCharCode(parseInt(hex.replace("\\x", ""), 16))).join("");
      return decodedString;
    }
    return encodedString;
  } catch (e) {
    console.error("Failed to decode UTF-8 string", e);
    return encodedString;
  }
}

// Function to tokenize Korean text by words
function tokenizeKorean(text) {
  const regex = /[\p{L}\p{N}]+|[.,!?]/gu;
  return text.match(regex) || [];
}
