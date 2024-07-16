import * as S from "./styles";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";

export default function Layer3({ newResponse }) {
  const logProbs = useMemo(() => {
    if (!newResponse) return [];

    const tokens = tokenizeKorean(newResponse.message.content);
    const topLogProbs = newResponse.logprobs.content;

    // Aggregate token log probabilities into word log probabilities

    const wordLogProbs = tokens.map((token) => {
      // Combine adjacent log probabilities to form words
      const combinedLogProbs = topLogProbs.filter((logProb) => {
        const decodedToken = decode(logProb.token).replace(/\s+/g, "");
        return token.includes(decodedToken);
      });

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
          <S.Candidate key={i} focus={i === focusCandidateIdx}>
            <p>{candidate.token}</p>
          </S.Candidate>
        ))}
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

// New function to combine adjacent log probabilities to form words
function combineLogProbs(logProbs) {
  let combined = [];
  let currentWord = "";
  let currentLogProbs = [];

  logProbs.forEach((logProb) => {
    const decodedToken = decode(logProb.token);
    if (currentWord && !currentWord.endsWith(decodedToken[0])) {
      combined.push({
        token: currentWord,
        top_logprobs: currentLogProbs,
      });
      currentWord = "";
      currentLogProbs = [];
    }
    currentWord += decodedToken;
    currentLogProbs.push(...logProb.top_logprobs);
  });

  if (currentWord) {
    combined.push({
      token: currentWord,
      top_logprobs: currentLogProbs,
    });
  }

  return combined;
}
