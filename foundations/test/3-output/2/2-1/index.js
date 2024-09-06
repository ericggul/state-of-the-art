import * as S from "./styles";
import { Fragment, useState, useEffect, useMemo, useCallback } from "react";
import useLogProbs from "@/foundations/test/3-output/utils/useLogProbsFiltered2";
import usePosCalc from "./usePosCalc";

function topLogProbsInclToken(logProb) {
  return {
    ...logProb,
    top_logprobs: [{ token: logProb.token, percentage: 100 }, ...logProb.top_logprobs],
  };
}

export default function Layer3({ newResponse }) {
  const logProbs = useLogProbs({ newResponse });
  console.log(logProbs);

  const { wordPosCalc, wordInterval, verticalInterval, xMargin } = usePosCalc({ logProbs, tokens: logProbs.map((el) => el.token) });

  return (
    <S.Container>
      <Tokens logProbs={logProbs} wordPosCalc={wordPosCalc} show={true} />
    </S.Container>
  );
}

function Tokens({ logProbs, wordPosCalc, show }) {
  return (
    <S.Tokens
      style={{
        opacity: show ? 1 : 0,
      }}
    >
      {logProbs.map((token, i) => (
        <Token xIdx={i} key={i} token={token.token} logprobs={token.top_logprobs} wordPosCalc={wordPosCalc} />
      ))}
    </S.Tokens>
  );
}

function Token({ xIdx, token, logprobs, wordPosCalc }) {
  console.log(logprobs);

  return (
    <Fragment>
      {logprobs.map((target, yIdx) => (
        <S.Candidate
          style={{
            left: wordPosCalc(xIdx, yIdx)[0],
            top: wordPosCalc(xIdx, yIdx)[1],
            opacity: (10 * target.percentage) / 100 + 0.1,
          }}
          key={yIdx}
        >
          {target.token}
        </S.Candidate>
      ))}
    </Fragment>
  );
}
