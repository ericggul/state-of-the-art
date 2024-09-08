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
  const logProbs = useLogProbs({ newResponse });

  const { wordPosCalc, wordInterval, verticalInterval, xMargin } = usePosCalc({ logProbs, tokens: logProbs.map((el) => el.token) });

  // Bezier params to animate the path
  const [bezierParams, setBezierParams] = useState(BEZIER_DEFAULT);

  useRandomInterval(
    () => {
      setBezierParams({
        controlX1Factor: getRandom(-2, 3),
        controlX2Factor: getRandom(-2, 3),
        controlY1Factor: getRandom(-3, 3),
        controlY2Factor: getRandom(-3, 3),
      });
    },
    5,
    100
  );

  return (
    <S.Container>
      <SVGComp logProbs={logProbs} wordPosCalc={wordPosCalc} bezierParams={bezierParams} xMargin={xMargin} />
      <Tokens logProbs={logProbs} wordPosCalc={wordPosCalc} show={true} />
    </S.Container>
  );
}

function SVGComp({ logProbs, wordPosCalc, bezierParams, xMargin }) {
  // Function to create an animated arc path between two points
  const createBezierPath = useCallback(
    (x1, y1, x2, y2, startLength, endLength) => {
      const controlX1 = x1 + (x2 - x1) * bezierParams.controlX1Factor;
      const controlY1 = y1 + (y2 - y1) * bezierParams.controlY1Factor;
      const controlX2 = x2 - (x2 - x1) * bezierParams.controlX2Factor;
      const controlY2 = y2 - (y2 - y1) * bezierParams.controlY2Factor;

      return `M${x1 + xMargin * startLength},${y1} C${controlX1},${controlY1} ${controlX2},${controlY2} ${x2 - xMargin * endLength},${y2}`;
    },
    [bezierParams, xMargin]
  );

  return (
    <S.Pic>
      {logProbs &&
        logProbs.map(
          (startLogProb, startIdx) =>
            startIdx + 1 < logProbs.length &&
            topLogProbsInclToken(startLogProb).top_logprobs.map((start, i) =>
              topLogProbsInclToken(logProbs[startIdx + 1]).top_logprobs.map(
                (end, j) =>
                  (i === 0 || j === 0) && (
                    <path
                      key={`arc-${startIdx}-${startIdx + 1}-${i}-${j}`}
                      d={createBezierPath(
                        wordPosCalc(startIdx, i - 1)[0],
                        wordPosCalc(startIdx, i - 1)[1],
                        wordPosCalc(startIdx + 1, j - 1)[0],
                        wordPosCalc(startIdx + 1, j - 1)[1],
                        start.token.length,
                        end.token.length
                      )}
                      stroke="white"
                      fill="none"
                      strokeWidth={(start.percentage + end.percentage) / 400}
                    />
                  )
              )
            )
        )}
    </S.Pic>
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
            opacity: 0.5 - Math.abs(yIdx - 10) * 0.01,
          }}
          key={yIdx}
        >
          {target.token + "|" + target.percentage.toFixed(2) + "%"}
        </S.Candidate>
      ))}
    </Fragment>
  );
}
