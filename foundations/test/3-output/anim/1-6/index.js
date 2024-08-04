import * as S from "./styles";
import { Fragment, useState, useEffect, useMemo, useCallback } from "react";
import useLogProbs from "@/foundations/test/3-output/utils/useLogProbsFiltered";
import usePosCalc from "./usePosCalc";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

function topLogProbsInclToken(logProb) {
  return {
    ...logProb,
    top_logprobs: [{ token: logProb.token, percentage: 100 }, ...logProb.top_logprobs],
  };
}

const getRandom = (a, b) => Math.random() * (b - a) + a;

export default function Layer3({ newResponse }) {
  const logProbs = useLogProbs({ newResponse, filter: 0.5 });

  const { wordPosCalc, wordInterval, verticalInterval, xMargin } = usePosCalc({ logProbs, tokens: logProbs.map((el) => el.token) });

  const [testParam, setTestParam] = useState({
    x: 0.5,
    y: 0,
  });
  useRandomInterval(
    () =>
      setTestParam({
        x: getRandom(-3, 4),
        y: getRandom(-1, 1),
      }),
    10,
    100
  );

  return (
    <S.Container>
      <SVGComp logProbs={logProbs} wordPosCalc={wordPosCalc} xMargin={xMargin} testParam={testParam} />
      <Tokens logProbs={logProbs} wordPosCalc={wordPosCalc} />
    </S.Container>
  );
}

function SVGComp({ logProbs, wordPosCalc, xMargin, testParam }) {
  // Function to create an arc path between two points

  const createBezierPath = useCallback(
    (x1, y1, x2, y2) => {
      const xFollow = Math.random() < 0.5 ? testParam.x : 1 - testParam.x;
      const yFollow = Math.random() < 0.5 ? testParam.y : -testParam.y;
      const controlX1 = x1 + (x2 - x1) * xFollow;
      const controlY1 = y1 + (y2 - y1) * yFollow;
      const controlX2 = x2 - (x2 - x1) * xFollow;
      const controlY2 = y2 - (y2 - y1) * yFollow;

      return `M${x1},${y1} C${controlX1},${controlY1} ${controlX2},${controlY2} ${x2},${y2}`;
    },
    [xMargin, testParam]
  );

  return (
    <S.Pic>
      {logProbs &&
        logProbs.map(
          (startLogProb, startIdx) =>
            startIdx + 1 < logProbs.length &&
            topLogProbsInclToken(startLogProb).top_logprobs.map((start, i) =>
              topLogProbsInclToken(logProbs[startIdx + 1]).top_logprobs.map((end, j) => (
                <path
                  key={`arc-${startIdx}-${startIdx + 1}-${i}-${j}`}
                  d={createBezierPath(wordPosCalc(startIdx, i - 1)[0], wordPosCalc(startIdx, i - 1)[1], wordPosCalc(startIdx + 1, j - 1)[0], wordPosCalc(startIdx + 1, j - 1)[1])}
                  stroke={"white"}
                  strokeWidth={1}
                  opacity={0.2}
                  fill="none"
                />
              ))
            )
        )}
    </S.Pic>
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
      <div
        style={{
          opacity: 1,
          transition: "all 0.4s",
        }}
      >
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
      </div>
    </Fragment>
  );
}
