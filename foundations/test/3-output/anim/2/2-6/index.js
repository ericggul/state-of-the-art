import * as S from "./styles";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import useLogProbs from "./useLogProbs";
import usePosCalc from "./usePosCalc";

const BEZIER_DEFAULT = {
  controlX1Factor: 0.5,
  controlX2Factor: 0.5,
  controlY1Factor: 0,
  controlY2Factor: 0,
};

const BASE_CYCLE_DURATION = 500;
const RANDOM_FACTOR = 0.8;

const CYCLE_DURATIONS = {
  controlX1Factor: BASE_CYCLE_DURATION,
  controlX2Factor: BASE_CYCLE_DURATION * 1.5,
  controlY1Factor: BASE_CYCLE_DURATION * 0.5,
  controlY2Factor: BASE_CYCLE_DURATION * 2.0,
};

const getRandom = (a, b) => Math.random() * (b - a) + a;

const getCyclicalValue = (time, min, max, cycleDuration) => {
  const normalizedTime = (time % cycleDuration) / cycleDuration;
  return min + ((max - min) * (Math.sin(normalizedTime * Math.PI * 2) + 1)) / 2;
};

export default function Layer3({ newResponse }) {
  const logProbs = useLogProbs({
    newResponse,
    filter: 0.9,
  });
  const { wordPosCalc, wordInterval, verticalInterval } = usePosCalc({ logProbs, tokens: logProbs.map((el) => el.token) });

  const [bezierParams, setBezierParams] = useState(BEZIER_DEFAULT);
  const [isBlack, setIsBlack] = useState(false);
  const timeRef = useRef(0);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setIsBlack((prev) => !prev), 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateBezierParams = () => {
      const time = Date.now();
      timeRef.current = time;

      const x1 = getCyclicalValue(time, -0.5, 1.5, CYCLE_DURATIONS.controlX1Factor) + getRandom(-RANDOM_FACTOR, RANDOM_FACTOR);
      const y1 = getCyclicalValue(time, -4.5, 4.5, CYCLE_DURATIONS.controlY1Factor) + getRandom(-RANDOM_FACTOR, RANDOM_FACTOR);

      setBezierParams((prevParams) => ({
        controlX1Factor: x1,
        controlX2Factor: 1 - x1,
        controlY1Factor: y1,
        controlY2Factor: y1,
      }));

      if (isBlack) animationFrameRef.current = requestAnimationFrame(updateBezierParams);
    };

    if (isBlack) {
      animationFrameRef.current = requestAnimationFrame(updateBezierParams);
      return () => cancelAnimationFrame(animationFrameRef.current);
    } else {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [isBlack]);

  return (
    <S.Container isBlack={!isBlack}>
      <SVGComp logProbs={logProbs} wordPosCalc={wordPosCalc} bezierParams={bezierParams} />
      <Tokens logProbs={logProbs} wordPosCalc={wordPosCalc} />
    </S.Container>
  );
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
                      startIdx,
                      endIdx,
                      i,
                      j,
                      strokeWidth: 0.3,
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
      {paths.map((pathProps, idx) => (
        <SinglePath key={idx} {...pathProps} wordPosCalc={wordPosCalc} createBezierPath={createBezierPath} />
      ))}
    </S.Pic>
  );
});

const SinglePath = React.memo(function SinglePath({ startIdx, endIdx, wordPosCalc, createBezierPath, i, j, strokeWidth }) {
  const d = createBezierPath(...wordPosCalc(startIdx, i - 1), ...wordPosCalc(endIdx, j - 1));
  return <path d={d} fill="none" opacity={1} strokeWidth={strokeWidth} />;
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
