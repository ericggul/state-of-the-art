import * as S from "./styles";
import { useMemo, useCallback, useState, useEffect } from "react";
import usePosCalc from "./usePosCalc";
import { useComputeCrossSimlarity } from "@/foundations/test/1-relation/utils/useComputeSimilarity";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

const BEZIER_DEFAULT = {
  controlX1Factor: 0,
  controlX2Factor: 1,
  controlY1Factor: 10,
  controlY2Factor: 5,
};

const getRandom = (a, b) => Math.random() * (b - a) + a;

export default function Layer1({ newInputEmbeddings, newOutputEmbeddings }) {
  const { embeddings: inputEmbeddings, tokens: inputTokens } = newInputEmbeddings;
  const { embeddings: outputEmbeddings, tokens: outputTokens } = newOutputEmbeddings;
  const crossSimilarityMatrix = useComputeCrossSimlarity({
    newInputEmbeddings,
    newOutputEmbeddings,
  });

  const { wordPosCalc: inputWordPosCalc, wordInterval: inputWordInterval, yMargin: inputyMargin } = usePosCalc({ tokens: inputTokens, type: "input" });
  const { wordPosCalc: outputWordPosCalc, wordInterval: outputWordInterval, yMargin: outputyMargin } = usePosCalc({ tokens: outputTokens, type: "output" });

  const [bezierParams, setBezierParams] = useState(BEZIER_DEFAULT);

  useRandomInterval(
    () => {
      setBezierParams({
        controlX1Factor: getRandom(-1, 2),
        controlX2Factor: getRandom(-1, 2),
        controlY1Factor: getRandom(-15, 35),
        controlY2Factor: getRandom(-15, 35),
      });
    },
    5,
    10
  );

  const [opacity, setOpacity] = useState(1);

  const createBezierPath = (x1, y1, x2, y2) => {
    const follow = Math.random() < 0.5;
    const followVal = (val, scale = 1) => val;

    const controlX1 = x1 + (x2 - x1) * followVal(bezierParams.controlX1Factor);
    const controlY1 = y1 + inputyMargin * followVal(bezierParams.controlY1Factor, 20);
    const controlX2 = x1 + (x2 - x1) * followVal(bezierParams.controlX2Factor);
    const controlY2 = y2 - outputyMargin * followVal(bezierParams.controlY2Factor, 20);

    return `M${x1},${y1 + inputyMargin} C${controlX1},${controlY1} ${controlX2},${controlY2} ${x2},${y2 - outputyMargin}`;
  };

  return (
    <S.Container>
      {inputTokens.map((token, i) => (
        <S.Token
          key={i}
          style={{
            left: inputWordPosCalc(i)[0],
            top: inputWordPosCalc(i)[1],
            width: inputWordInterval,
          }}
        >
          {token}
        </S.Token>
      ))}

      {outputTokens.map((token, i) => (
        <SingleOutputToken key={i} i={i} outputWordInterval={outputWordInterval} outputWordPosCalc={outputWordPosCalc} token={token} />
      ))}

      <S.Pic
        style={{
          opacity,
        }}
      >
        {inputTokens.map((token, i) =>
          outputTokens.map((targetToken, j) => (
            <path
              key={`arc-${i}-${j}`}
              d={createBezierPath(inputWordPosCalc(i)[0], inputWordPosCalc(i)[1], outputWordPosCalc(j)[0], outputWordPosCalc(j)[1])}
              stroke="white"
              fill="none"
              strokeWidth={crossSimilarityMatrix[i][j] > 0.2 ? crossSimilarityMatrix[i][j] ** 3 * 4 : 0}
            />
          ))
        )}
      </S.Pic>
    </S.Container>
  );
}

function SingleOutputToken({ i, outputWordInterval, outputWordPosCalc, token }) {
  const [displayToken, setDisplayToken] = useState(token);

  useRandomInterval(
    () =>
      setDisplayToken((given) => {
        // If the given token is not the current token, return the current token
        if (given !== token) return token;

        // Otherwise, generate a random string of 0s and 1s of the same length as the token
        let randomString = Array.from({ length: token.length }, () => Math.round(Math.random())).join("");
        return randomString;
      }),
    10,
    1000
  );

  return (
    <S.Token
      style={{
        left: outputWordPosCalc(i)[0],
        top: outputWordPosCalc(i)[1],
        width: outputWordInterval,
      }}
    >
      {displayToken}
    </S.Token>
  );
}
