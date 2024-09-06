import * as S from "./styles";
import { Fragment, useState, useEffect, useMemo, useCallback } from "react";
import useLogProbs from "@/foundations/test/3-output/utils/useLogProbsFiltered2";
import usePosCalc from "./usePosCalc";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

export default function Layer3({ newResponse }) {
  const logProbs = useLogProbs({ newResponse, filter: 0.02 });

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
  const [show, setShow] = useState(0);

  useRandomInterval(
    () => {
      setShow(Math.floor(Math.random() * logprobs.length));
    },
    5,
    200
  );

  return (
    <Fragment>
      <S.Candidate
        style={{
          left: wordPosCalc(xIdx, -1)[0],
          top: wordPosCalc(xIdx, -1)[1],
        }}
      >
        {logprobs[show].token} | {logprobs[show].percentage.toFixed(2) + "%"}
      </S.Candidate>

      {logprobs
        .filter((_, idx) => idx !== show)
        //random order
        .sort(() => Math.random() - 0.5)
        .map((target, yIdx) => (
          <S.Candidate
            style={{
              left: wordPosCalc(xIdx, yIdx)[0],
              top: wordPosCalc(xIdx, yIdx)[1],
              opacity: 0.5 - Math.abs(yIdx - logprobs.length / 2) * 0.05,
            }}
            key={yIdx}
          >
            {target.token} | {target.percentage.toFixed(2) + "%"}
          </S.Candidate>
        ))}
    </Fragment>
  );
}
