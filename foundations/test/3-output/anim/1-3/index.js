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

  const { wordPosCalc, wordInterval, verticalInterval, xMargin } = usePosCalc({ logProbs, tokens: logProbs.map((el) => el.token) });

  const [expandedIdx, setExpandedIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setExpandedIdx((expandedIdx) => (expandedIdx + 1) % logProbs.length);
    }, 400);
    return () => clearInterval(interval);
  }, [logProbs.length]);

  return (
    <S.Container>
      <SVGComp logProbs={logProbs} wordPosCalc={wordPosCalc} xMargin={xMargin} expandedIdx={expandedIdx} />
      <Tokens logProbs={logProbs} wordPosCalc={wordPosCalc} expandedIdx={expandedIdx} />
    </S.Container>
  );
}

function SVGComp({ logProbs, wordPosCalc, xMargin, expandedIdx }) {
  // Function to create an arc path between two points

  const createBezierPath = useCallback(
    (x1, y1, x2, y2) => {
      const controlX1 = x1 + (x2 - x1) / 2;
      const controlY1 = y1;
      const controlX2 = x2 - (x2 - x1) / 2;
      const controlY2 = y2;

      return `M${x1},${y1} C${controlX1},${controlY1} ${controlX2},${controlY2} ${x2},${y2}`;
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
              topLogProbsInclToken(logProbs[startIdx + 1]).top_logprobs.map((end, j) => (
                <path
                  key={`arc-${startIdx}-${startIdx + 1}-${i}-${j}`}
                  d={createBezierPath(wordPosCalc(startIdx, i - 1)[0], wordPosCalc(startIdx, i - 1)[1], wordPosCalc(startIdx + 1, j - 1)[0], wordPosCalc(startIdx + 1, j - 1)[1])}
                  stroke={"blue"}
                  strokeWidth={1}
                  opacity={(expandedIdx === startIdx && j === 0) || (expandedIdx == startIdx + 1) & (i === 0) ? 1 : 0.1}
                  fill="none"
                />
              ))
            )
        )}
    </S.Pic>
  );
}

function Tokens({ logProbs, wordPosCalc, expandedIdx }) {
  return (
    <S.Tokens>
      {logProbs.map((token, i) => (
        <Token xIdx={i} key={i} expanded={expandedIdx === i} token={token.token} logprobs={token.top_logprobs} wordPosCalc={wordPosCalc} />
      ))}
    </S.Tokens>
  );
}

function Token({ xIdx, token, logprobs, wordPosCalc, expanded }) {
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
          opacity: expanded ? 1 : 0.1,
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
