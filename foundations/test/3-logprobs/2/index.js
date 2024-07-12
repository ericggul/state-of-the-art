import * as S from "./styles";
import axios from "axios";

import { useState, useEffect, useMemo } from "react";
import useResize from "@/utils/hooks/useResize";

export default function Layer3({ newData, text }) {
  const logProbs = useMemo(() => (newData.generatedOutput ? newData.generatedOutput.logprobs.content : []), [newData]);

  return (
    <S.Container>
      <S.Tokens>
        {logProbs && logProbs.map((token, i) => <Token key={i} token={token.token} logprobs={token.top_logprobs} embedding={token.top_logprobs.map((el) => el.logprob.toFixed(2))} />)}
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
  return (
    <S.Token startswithspace={token.startsWith(" ") ? "true" : ""}>
      <p>{token}</p>
      {logprobs && (
        <>
          <S.Vector ispos={"true"}>
            <S.Inner>
              {logprobs
                .filter((_, i) => i % 2 === 0)
                .map((el) => `${el.token} (${logprobToPercentage(el.logprob).toFixed(1)}%)`)
                .join("\n")}
            </S.Inner>
          </S.Vector>
          {/* <S.Vector ispos={""}>{logprobs.map((el) => logprobToPercentage(el.logprob).toFixed(0) + "%").join("\n")}</S.Vector> */}
          <S.Vector ispos={""}>
            <S.Inner>
              {logprobs
                .filter((_, i) => i % 2 === 1)
                .map((el) => `${el.token} (${logprobToPercentage(el.logprob).toFixed(1)}%)`)
                .join("\n")}
              {/* {logprobs
                .filter((_, i) => i % 2 === 1)
                .map((el) => el.token)
                .join("\n")} */}
              {/* {logprobs
                .reverse()
                .map((el) => logprobToPercentage(el.logprob).toFixed(0) + "%")
                .join("\n")} */}
            </S.Inner>
          </S.Vector>
        </>
      )}
    </S.Token>
  );
}
