import * as S from "./styles";
import { Fragment, useState, useEffect, useMemo, useCallback } from "react";
import useLogProbs from "@/foundations/test/3-output/utils/useLogProbsFiltered";
import usePosCalc from "./usePosCalc";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval"; // Assuming you have this hook

const BEZIER_DEFAULT = {
  controlX1Factor: 0.5,
  controlX2Factor: 0.5,
  controlY1Factor: 0,
  controlY2Factor: 0,
};

function topLogProbsInclToken(logProb) {
  return {
    ...logProb,
    top_logprobs: [{ token: logProb.token, percentage: 100 }, ...logProb.top_logprobs],
  };
}

const getRandom = (a, b) => Math.random() * (b - a) + a;

export default function Layer3({ newResponse }) {
  const logProbs = useLogProbs({
    newResponse,
    filter: 1.0,
  });
  const { wordPosCalc, wordInterval, verticalInterval } = usePosCalc({ logProbs, tokens: logProbs.map((el) => el.token) });

  // Bezier params to animate the path
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
    150
  );

  return (
    <S.Container>
      <SVGComp logProbs={logProbs} wordPosCalc={wordPosCalc} bezierParams={bezierParams} />
      <Tokens logProbs={logProbs} wordPosCalc={wordPosCalc} />
    </S.Container>
  );
}

function SVGComp({ logProbs, wordPosCalc, bezierParams }) {
  // Function to create an animated arc path between two points
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

  return (
    <S.Pic>
      {logProbs &&
        logProbs.map((startLogProb, startIdx) =>
          logProbs.map(
            (endLogProb, endIdx) =>
              startIdx !== endIdx &&
              topLogProbsInclToken(startLogProb).top_logprobs.map((start, i) =>
                topLogProbsInclToken(endLogProb).top_logprobs.map(
                  (end, j) => (i === 0 || j === 0) && <SinglePath key={`${i}-${j}`} startIdx={startIdx} endIdx={endIdx} wordPosCalc={wordPosCalc} createBezierPath={createBezierPath} i={i} j={j} />
                )
              )
          )
        )}
    </S.Pic>
  );
}

function SinglePath({ startIdx, endIdx, wordPosCalc, createBezierPath, i, j }) {
  return (
    <path
      key={`arc-${startIdx}-${endIdx}-${i}-${j}`}
      d={createBezierPath(wordPosCalc(startIdx, i - 1)[0], wordPosCalc(startIdx, i - 1)[1], wordPosCalc(endIdx, j - 1)[0], wordPosCalc(endIdx, j - 1)[1])}
      stroke="white"
      fill="none"
      opacity={0.3}
    />
  );
}

function Tokens({ logProbs, wordPosCalc }) {
  return (
    <S.Tokens>
      {logProbs.map((token, i) => (
        <Token xIdx={i} key={i} token={token.token} logprobs={token.top_logprobs} wordPosCalc={wordPosCalc} />
      ))}
    </S.Tokens>
  );
}

function Token({ xIdx, token, logprobs, wordPosCalc }) {
  return (
    <Fragment>
      <S.Candidate
        style={{
          left: wordPosCalc(xIdx, -1)[0],
          top: wordPosCalc(xIdx, -1)[1],
        }}
      >
        {token}
      </S.Candidate>
      {logprobs.map((target, yIdx) => (
        <S.Candidate
          style={{
            left: wordPosCalc(xIdx, yIdx)[0],
            top: wordPosCalc(xIdx, yIdx)[1],
          }}
          key={yIdx}
        >
          {target.token}
        </S.Candidate>
      ))}
    </Fragment>
  );
}
