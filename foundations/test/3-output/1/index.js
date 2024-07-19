import * as S from "./styles";
import { Fragment, useState, useEffect, useMemo } from "react";
import useLogProbs from "../utils/useLogProbsFiltered";
import useRandomInterval from "@/utils/hooks/useRandomInterval";
import usePosCalc from "./usePosCalc";

export default function Layer3({ newResponse }) {
  const logProbs = useLogProbs({ newResponse });

  const { wordPosCalc, wordInterval, verticalInterval } = usePosCalc({ logProbs, tokens: logProbs.map((el) => el.token) });

  // Function to create an arc path between two points
  const createBezierPath = (x1, y1, x2, y2) => {
    const controlX1 = x1 + (x2 - x1) / 2;
    const controlY1 = y1;
    const controlX2 = x2 - (x2 - x1) / 2;
    const controlY2 = y2;

    return `M${x1},${y1} C${controlX1},${controlY1} ${controlX2},${controlY2} ${x2},${y2}`;
  };

  return (
    <S.Container>
      <S.Tokens>
        {logProbs.map((token, i) => (
          <Token xIdx={i} key={i} token={token.token} logprobs={token.top_logprobs} wordPosCalc={wordPosCalc} />
        ))}
      </S.Tokens>

      <S.Pic>
        {logProbs &&
          logProbs.map((startLogProb, startIdx) =>
            logProbs.map(
              (endLogProb, endIdx) =>
                startIdx !== endIdx &&
                startLogProb.top_logprobs.map((start, i) =>
                  endLogProb.top_logprobs.map((end, j) => (
                    <path
                      key={`arc-${startIdx}-${endIdx}-${i}-${j}`}
                      d={createBezierPath(wordPosCalc(startIdx, i)[0], wordPosCalc(startIdx, i)[1], wordPosCalc(endIdx, j)[0], wordPosCalc(endIdx, j)[1])}
                      stroke="white"
                      fill="none"
                      opacity={0.05}
                    />
                  ))
                )
            )
          )}
      </S.Pic>
    </S.Container>
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
