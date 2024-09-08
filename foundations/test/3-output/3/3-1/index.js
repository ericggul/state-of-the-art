import * as S from "./styles";
import { Fragment, useState, useEffect, useMemo, useCallback } from "react";
import useLogProbs from "@/foundations/test/3-output/utils/useLogProbs";
import usePosCalc from "./usePosCalc";

function topLogProbsInclToken(logProb) {
  console.log(logProb);
  return {
    ...logProb,
    top_logprobs: [{ token: logProb.token, percentage: 100 }, ...logProb.top_logprobs],
  };
}

export default function Layer3({ newResponse }) {
  const logProbs = useLogProbs({ newResponse });

  const { wordPosCalc, wordInterval, verticalInterval, xMargin } = usePosCalc({ logProbs, tokens: logProbs.map((el) => el.token) });

  return (
    <S.Container>
      <SVGComp logProbs={logProbs} wordPosCalc={wordPosCalc} show={true} xMargin={xMargin} />
      <Tokens logProbs={logProbs} wordPosCalc={wordPosCalc} show={true} />
    </S.Container>
  );
}

function SVGComp({ logProbs, wordPosCalc, show, xMargin }) {
  // Function to create an arc path between two points

  const createBezierPath = useCallback(
    (x1, y1, x2, y2, startLength, endLength) => {
      const controlX1 = x1 + (x2 - x1) / 2;
      const controlY1 = y1;
      const controlX2 = x2 - (x2 - x1) / 2;
      const controlY2 = y2;

      return `M${x1 + xMargin * startLength},${y1} C${controlX1},${controlY1} ${controlX2},${controlY2} ${x2 - xMargin * endLength},${y2}`;
    },
    [xMargin]
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
                  i === 0 && (
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
                      strokeWidth={j === 0 ? 1 : 0.5 - Math.abs(j - 10) * 0.03}
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
          {target.token}
        </S.Candidate>
      ))}
    </Fragment>
  );
}
