import { useState, useEffect, useMemo } from "react";

export default function useLogProbs({ newResponse }) {
  const logProbs = useMemo(() => {
    if (!newResponse) return [];

    const topLogProbs = newResponse.logprobs.content;
    const { tokens, combinedIndices } = combineSyllablesAndGenerateNewTokens(topLogProbs);
    console.log(tokens);

    const wordLogProbs = combinedIndices.map((indices, idx) => {
      // Combine adjacent log probabilities to form words
      const combinedLogProbs = indices.map((index) => topLogProbs[index]);
      console.log(combinedLogProbs);

      const aggregatedLogProbs = combinedLogProbs.reduce((acc, curr) => {
        curr.top_logprobs.forEach((el) => {
          const existing = acc.find((log) => log.token === el.token);
          console.log(el, existing, curr);
          if (existing) {
            existing.logprob = Math.max(existing.logprob, el.logprob);
          } else {
            acc.push(el);
          }
        });
        return acc;
      }, []);

      return {
        token: tokens[idx],
        top_logprobs: aggregatedLogProbs,
      };
    });

    return wordLogProbs;
  }, [newResponse]);

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
    console.log(hexMatches, indices);

    if (hexMatches) {
      const utf8Bytes = new Uint8Array(hexMatches.map((hex) => parseInt(hex.replace("\\x", ""), 16)));
      return utf8Decode(utf8Bytes);
    } else {
      return combinedToken;
    }
  });
  return { tokens: newTokens, combinedIndices };
}
