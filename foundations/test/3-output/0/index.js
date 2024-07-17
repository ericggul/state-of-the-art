import * as S from "./styles";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";

export default function Layer3({ newResponse }) {
  const logProbs = useMemo(() => {
    if (!newResponse) return [];

    const tokens = tokenizeKorean(newResponse.message.content);
    const topLogProbs = newResponse.logprobs.content;

    const result = combineSyllablesAndGenerateNewTokens(topLogProbs);
    console.log(result);

    const wordLogProbs = tokens.map((token) => {
      // Combine adjacent log probabilities to form words
      const combinedLogProbs = topLogProbs.filter((logProb) => {
        const decodedToken = decode2(logProb.token).replace(/\s+/g, "");
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
          <S.Candidate key={i} isfocus={i === focusCandidateIdx ? "true" : undefined}>
            <p>{decode(candidate.token)}</p>
          </S.Candidate>
        ))}
    </S.Token>
  );
}

// Function to decode UTF-8 encoded strings to Unicode characters
function decode2(bytes) {
  let decoder = new TextDecoder("utf-8");
  let result = decoder.decode(new Uint8Array(bytes));
  return result;
}

// Function to decode UTF-8 encoded strings to Unicode characters
function decode(hexString) {
  // Check if the string contains hexadecimal escape sequences
  if (!hexString.includes("\\x")) {
    return hexString;
  }

  // Remove the \x prefix
  let hex = hexString.replace(/\\x/g, "");

  // Split the hex string into pairs of characters
  let hexPairs = hex.match(/.{1,2}/g);

  // Convert hex pairs to a byte array
  let bytes = new Uint8Array(hexPairs.map((pair) => parseInt(pair, 16)));

  // Use TextDecoder to decode the byte array as UTF-8
  let decoder = new TextDecoder("utf-8");
  let result = decoder.decode(bytes);

  return result;
}

// Function to tokenize Korean text by words
function tokenizeKorean(text) {
  const regex = /[\p{L}\p{N}]+|[.,!?]/gu;
  return text.match(regex) || [];
}

function combineSyllables(logProbs) {
  const combined = [];
  let i = 0;

  while (i < logProbs.length) {
    const currentToken = logProbs[i];
    const tokenStr = JSON.stringify(currentToken.token);

    if (tokenStr.includes("\\x")) {
      if (i > 0 && JSON.stringify(logProbs[i - 1].token).includes("\\x")) {
        combined[combined.length - 1].push(i);
      } else {
        combined.push([i]);
      }
    } else {
      combined.push([i]);
    }

    i++;
  }

  return combined;
}

function decodeUnicodeEscapeSequences(hexString) {
  return hexString.replace(/\\x([0-9A-Fa-f]{2})/g, (_, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  });
}

function utf8Decode(bytes) {
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(bytes);
}

function combineSyllablesAndGenerateNewTokens(logProbs) {
  const combinedIndices = combineSyllables(logProbs);
  const newTokens = combinedIndices.map((indices) => {
    const combinedToken = indices.map((index) => logProbs[index].token).join("");
    const hexMatches = combinedToken.match(/\\x([0-9A-Fa-f]{2})/g);
    if (hexMatches) {
      const utf8Bytes = new Uint8Array(hexMatches.map((hex) => parseInt(hex.replace("\\x", ""), 16)));
      return utf8Decode(utf8Bytes);
    } else {
      return decodeUnicodeEscapeSequences(combinedToken);
    }
  });
  return newTokens;
}
