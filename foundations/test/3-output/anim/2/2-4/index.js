import * as S from "./styles";
import React, { Fragment, useState, useEffect, useMemo, useCallback } from "react";
import useLogProbs from "@/foundations/test/3-output/utils/useLogProbsFiltered";
import usePosCalc from "./usePosCalc";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

const BEZIER_DEFAULT = {
  controlX1Factor: 0.5,
  controlX2Factor: 0.5,
  controlY1Factor: 0,
  controlY2Factor: 0,
};

const getRandom = (a, b) => Math.random() * (b - a) + a;

export default function Layer3({ newResponse }) {
  const logProbs = useLogProbs({
    newResponse,
    filter: 1.0,
  });
  const { wordPosCalc, wordInterval, verticalInterval } = usePosCalc({ logProbs, tokens: logProbs.map((el) => el.token) });

  const [bezierParams, setBezierParams] = useState(BEZIER_DEFAULT);

  useRandomInterval(
    () => {
      setBezierParams({
        controlX1Factor: getRandom(-0.5, 1.5),
        controlX2Factor: getRandom(-0.5, 1.5),
        controlY1Factor: getRandom(-5, 5),
        controlY2Factor: getRandom(-5, 5),
      });
    },
    5,
    50
  );

  const memoizedLogProbs = useMemo(() => {
    return logProbs.map(topLogProbsInclToken);
  }, [logProbs]);

  return (
    <S.Container>
      <SVGComp logProbs={memoizedLogProbs} wordPosCalc={wordPosCalc} bezierParams={bezierParams} />
      <Tokens logProbs={memoizedLogProbs} wordPosCalc={wordPosCalc} />
    </S.Container>
  );
}

function topLogProbsInclToken(logProb) {
  return {
    ...logProb,
    top_logprobs: [{ token: logProb.token, percentage: 100 }, ...logProb.top_logprobs],
  };
}

const SVGComp = React.memo(function SVGComp({ logProbs, wordPosCalc, bezierParams }) {
  const createBezierPath = useCallback(
    (x1, y1, x2, y2) => {
      const params = Math.random() < 1.0 ? bezierParams : BEZIER_DEFAULT;
      const controlX1 = x1 + (x2 - x1) * params.controlX1Factor;
      const controlY1 = y1 + (y2 - y1) * params.controlY1Factor;
      const controlX2 = x2 - (x2 - x1) * params.controlX2Factor;
      const controlY2 = y2 - (y2 - y1) * params.controlY2Factor;

      return `M${x1},${y1} C${controlX1},${controlY1} ${controlX2},${controlY2} ${x2},${y2}`;
    },
    [bezierParams]
  );

  const paths = useMemo(() => {
    return logProbs
      .flatMap((startLogProb, startIdx) =>
        logProbs.flatMap((endLogProb, endIdx) =>
          startIdx !== endIdx
            ? startLogProb.top_logprobs.flatMap((start, i) =>
                endLogProb.top_logprobs.map(
                  (end, j) =>
                    (i === 0 || j === 0) && {
                      key: `${startIdx}-${endIdx}-${i}-${j}`,
                      startIdx,
                      endIdx,
                      i,
                      j,
                      strokeWidth: (start.percentage + end.percentage) / 400,
                    }
                )
              )
            : []
        )
      )
      .filter(Boolean);
  }, [logProbs]);

  return (
    <S.Pic>
      {paths.map((pathProps) => (
        <SinglePath key={pathProps.key} {...pathProps} wordPosCalc={wordPosCalc} createBezierPath={createBezierPath} />
      ))}
    </S.Pic>
  );
});

const SinglePath = React.memo(function SinglePath({ startIdx, endIdx, wordPosCalc, createBezierPath, i, j, strokeWidth }) {
  const d = createBezierPath(...wordPosCalc(startIdx, i - 1), ...wordPosCalc(endIdx, j - 1));

  return <path d={d} stroke="white" fill="none" opacity={0.5} strokeWidth={strokeWidth} />;
});

const Tokens = React.memo(function Tokens({ logProbs, wordPosCalc }) {
  return (
    <S.Tokens>
      {logProbs.map((token, i) => (
        <Token key={i} xIdx={i} token={token.token} logprobs={token.top_logprobs} wordPosCalc={wordPosCalc} />
      ))}
    </S.Tokens>
  );
});

const Token = React.memo(function Token({ xIdx, token, logprobs, wordPosCalc }) {
  return (
    <>
      <S.Candidate style={{ left: wordPosCalc(xIdx, -1)[0], top: wordPosCalc(xIdx, -1)[1] }}>{token}</S.Candidate>
      {logprobs.map((target, yIdx) => (
        <S.Candidate
          key={yIdx}
          style={{
            left: wordPosCalc(xIdx, yIdx)[0],
            top: wordPosCalc(xIdx, yIdx)[1],

            opacity: 0.5,
          }}
        >
          <p>{target.token}</p>
          <p>{target.percentage.toFixed(2) + "%"}</p>
        </S.Candidate>
      ))}
    </>
  );
});
