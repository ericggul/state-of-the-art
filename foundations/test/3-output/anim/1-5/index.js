import * as S from "./styles";
import { Fragment, useState, useEffect, useMemo, useCallback } from "react";
import useLogProbs from "@/foundations/test/3-output/utils/useLogProbsFiltered";
import usePosCalc from "./usePosCalc";

function topLogProbsInclToken(logProb) {
  return {
    ...logProb,
    top_logprobs: [{ token: logProb.token, percentage: 100 }, ...logProb.top_logprobs],
  };
}

export default function Layer3({ newResponse }) {
  const logProbs = useLogProbs({ newResponse });

  const { wordPosCalc, wordInterval, verticalInterval } = usePosCalc({ logProbs, tokens: logProbs.map((el) => el.token) });

  return (
    <S.Container>
      <SVGComp logProbs={logProbs} wordPosCalc={wordPosCalc} />
      <Tokens logProbs={logProbs} wordPosCalc={wordPosCalc} />
    </S.Container>
  );
}

function SVGComp({ logProbs, wordPosCalc, show }) {
  // Function to create an arc path between two points

  const createBezierPath = useCallback((x1, y1, x2, y2) => {
    const controlX1 = x1 + (x2 - x1) / 2;
    const controlY1 = y1;
    const controlX2 = x2 - (x2 - x1) / 2;
    const controlY2 = y2;

    return `M${x1},${y1} C${controlX1},${controlY1} ${controlX2},${controlY2} ${x2},${y2}`;
  }, []);

  return (
    <S.Pic>
      {logProbs &&
        logProbs.map((startLogProb, startIdx) =>
          logProbs.map(
            (endLogProb, endIdx) =>
              startIdx !== endIdx &&
              topLogProbsInclToken(startLogProb).top_logprobs.map((start, i) =>
                topLogProbsInclToken(endLogProb).top_logprobs.map(
                  (end, j) => i === 0 || (j === 0 && <SinglePath key={`${i}-${j}`} startIdx={startIdx} endIdx={endIdx} wordPosCalc={wordPosCalc} createBezierPath={createBezierPath} i={i} j={j} />)
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
      opacity={0.2}
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
