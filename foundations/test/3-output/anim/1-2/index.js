import * as S from "./styles";
import { Fragment, useMemo, useCallback, useState, useEffect } from "react";
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

  const [targetWordIdx, setTargetWordIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTargetWordIdx((prev) => (prev + 1) % logProbs.length);
    }, 400);

    return () => clearInterval(interval);
  }, [logProbs.length]);

  return (
    <S.Container>
      <SVGComp logProbs={logProbs} wordPosCalc={wordPosCalc} xMargin={xMargin} targetWordIdx={targetWordIdx} />
      <Tokens logProbs={logProbs} wordPosCalc={wordPosCalc} />
    </S.Container>
  );
}

function SVGComp({ logProbs, wordPosCalc, xMargin, targetWordIdx }) {
  const createBezierPath = useCallback(
    (x1, y1, x2, y2) => {
      const controlX1 = x1 + (x2 - x1) / 2;
      const controlY1 = y1;
      const controlX2 = x2 - (x2 - x1) / 2;
      const controlY2 = y2;

      return `M${x1 + xMargin},${y1} C${controlX1},${controlY1} ${controlX2},${controlY2} ${x2 - xMargin},${y2}`;
    },
    [xMargin]
  );

  return (
    <S.Pic>
      {logProbs.map((logProb, idx) =>
        topLogProbsInclToken(logProb).top_logprobs.map((start, i) =>
          topLogProbsInclToken(logProbs[targetWordIdx]).top_logprobs.map(
            (end, j) =>
              start.percentage + end.percentage > 10 &&
              idx !== targetWordIdx && (
                <S.Path
                  key={`arc-${idx}-${targetWordIdx}-${i}-${j}`}
                  d={createBezierPath(wordPosCalc(idx, i - 1)[0], wordPosCalc(idx, i - 1)[1], wordPosCalc(targetWordIdx, j - 1)[0], wordPosCalc(targetWordIdx, j - 1)[1])}
                />
              )
          )
        )
      )}
    </S.Pic>
  );
}

function Tokens({ logProbs, wordPosCalc, show = true }) {
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
          }}
          key={yIdx}
        >
          {target.token}
        </S.Candidate>
      ))}
    </Fragment>
  );
}
