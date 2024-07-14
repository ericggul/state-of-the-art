import * as S from "./styles";
import axios from "axios";

import { useState, useEffect, useMemo } from "react";
import useResize from "@/utils/hooks/useResize";

export default function Layer3({ newResponse, text }) {
  const logProbs = useMemo(() => (newResponse.generatedOutput ? newResponse.generatedOutput.logprobs.content : []), [newResponse]);

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

function Token({ token, logprobs }) {
  const transformedPercentage = useMemo(
    () =>
      logprobs
        .reverse()

        .map((el) => ({
          ...el,
          percentage: logprobToPercentage(el.logprob),
        }))

        //filter those with prob under 1
        .filter((el) => el.percentage > 1),
    [logprobs]
  );

  console.log(transformedPercentage);

  return (
    <S.Token startswithspace={token.startsWith(" ") ? "true" : ""}>
      <p>{token}</p>
      {logprobs && (
        <>
          <S.Vector>
            <S.Graph>
              {transformedPercentage.map((el, i) => (
                <S.El key={i} percentage={el.percentage}>
                  <p>{el.token}</p>
                  <p>{el.percentage.toFixed(2)} %</p>
                </S.El>
              ))}
            </S.Graph>
          </S.Vector>
        </>
      )}
    </S.Token>
  );
}
