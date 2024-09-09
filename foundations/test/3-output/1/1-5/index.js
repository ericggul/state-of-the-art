import * as S from "./styles";
import React, { Fragment, useMemo, useCallback } from "react";
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
  const { wordPosCalc } = usePosCalc({ logProbs, tokens: logProbs.map((el) => el.token) });

  // Memoize processed logProbs to avoid redundant recalculations
  const memoizedLogProbs = useMemo(() => logProbs.map(topLogProbsInclToken), [logProbs]);

  return (
    <S.Container>
      <SVGComp logProbs={memoizedLogProbs} wordPosCalc={wordPosCalc} />
      <Tokens logProbs={memoizedLogProbs} wordPosCalc={wordPosCalc} />
    </S.Container>
  );
}

const SVGComp = React.memo(function SVGComp({ logProbs, wordPosCalc }) {
  const createBezierPath = useCallback((x1, y1, x2, y2) => {
    const controlX1 = x1 + (x2 - x1) / 2;
    const controlY1 = y1;
    const controlX2 = x2 - (x2 - x1) / 2;
    const controlY2 = y2;

    return `M${x1},${y1} C${controlX1},${controlY1} ${controlX2},${controlY2} ${x2},${y2}`;
  }, []);

  // Use flatMap to simplify nested loops and memoize path calculations
  const paths = useMemo(() => {
    return logProbs.flatMap((startLogProb, startIdx) =>
      logProbs.flatMap((endLogProb, endIdx) =>
        startIdx !== endIdx
          ? startLogProb.top_logprobs.flatMap((start, i) =>
              endLogProb.top_logprobs.map(
                (end, j) =>
                  (i === 0 || j === 0) && (
                    <SinglePath key={`${startIdx}-${endIdx}-${i}-${j}`} startIdx={startIdx} endIdx={endIdx} wordPosCalc={wordPosCalc} createBezierPath={createBezierPath} i={i} j={j} />
                  )
              )
            )
          : []
      )
    );
  }, [logProbs, wordPosCalc, createBezierPath]);

  return <S.Pic>{paths}</S.Pic>;
});

const SinglePath = React.memo(function SinglePath({ startIdx, endIdx, wordPosCalc, createBezierPath, i, j }) {
  const d = useMemo(() => createBezierPath(...wordPosCalc(startIdx, i - 1), ...wordPosCalc(endIdx, j - 1)), [createBezierPath, startIdx, endIdx, i, j, wordPosCalc]);

  return <path d={d} stroke="white" fill="none" opacity={0.2} />;
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
          key={yIdx}
          style={{
            left: wordPosCalc(xIdx, yIdx)[0],
            top: wordPosCalc(xIdx, yIdx)[1],
          }}
        >
          {target.token}
        </S.Candidate>
      ))}
    </Fragment>
  );
});
