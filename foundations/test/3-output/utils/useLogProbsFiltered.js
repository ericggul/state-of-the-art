import { useState, useEffect, useMemo } from "react";

function logprobToPercentage(logprob) {
  let probability = Math.exp(logprob);
  let percentage = probability * 100;
  return percentage;
}

export default function useLogProbs({ newResponse, filter = 0.1 }) {
  const logProbs = useMemo(() => {
    if (!newResponse) return [];

    const topLogProbs = newResponse.logprobs.content;
    const { tokens, combinedIndices } = combineSyllablesAndGenerateNewTokens(topLogProbs);

    const wordLogProbs = combinedIndices.map((indices, idx) => {
      // Combine adjacent log probabilities to form words
      const combinedLogProbs = indices.map((index) => topLogProbs[index]);

      const aggregatedLogProbs = combinedLogProbs
        .reduce((acc, curr) => {
          curr.top_logprobs.forEach((el) => {
            const existing = acc.find((log) => log.token === el.token);
            if (existing) {
              existing.logprob = Math.max(existing.logprob, el.logprob);
            } else {
              acc.push(el);
            }
          });
          return acc;
        }, [])

        .filter((el) => logprobToPercentage(el.logprob) > filter && el.token !== tokens[idx])
        .map((el) => ({
          token: el.token,
          percentage: logprobToPercentage(el.logprob),
        }));

      return {
        token: tokens[idx],
        top_logprobs: aggregatedLogProbs,
      };
    });

    return wordLogProbs;
  }, [newResponse, filter]);

  return logProbs;
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
      return combinedToken;
    }
  });
  return { tokens: newTokens, combinedIndices };
}
