import * as S from "./styles";
import { useState, useEffect } from "react";
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

  const [bezierParams, setBezierParams] = useState(BEZIER_DEFAULT);
  const [isBlack, setIsBlack] = useState(true);
  const [xRange, setXRange] = useState(0);
  const [yRange, setYRange] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setXRange((r) => 1.5 - r);
      setYRange((r) => 18 - r);
      setIsBlack((b) => !b);
      setIsAnimating((animating) => !animating); // Toggle animation
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useRandomInterval(
    () => {
      setBezierParams({
        controlX1Factor: getRandom(0 - xRange, 0 + xRange),
        controlX2Factor: getRandom(0.7 - xRange, 0.7 + xRange),
        controlY1Factor: getRandom(10 - yRange, 10 + yRange),
        controlY2Factor: getRandom(10 - yRange, 10 + yRange),
      });
    },
    5,
    50
  );

  const { wordPosCalc: inputWordPosCalc, wordInterval: inputWordInterval, yMargin: inputyMargin } = usePosCalc({ tokens: inputTokens, type: "input", isAnimating });
  const { wordPosCalc: outputWordPosCalc, wordInterval: outputWordInterval, yMargin: outputyMargin } = usePosCalc({ tokens: outputTokens, type: "output", isAnimating });

  const createBezierPath = (x1, y1, x2, y2) => {
    const followVal = (val, scale = 1) => val;

    const controlX1 = x1 + (x2 - x1) * followVal(bezierParams.controlX1Factor);
    const controlY1 = y1 + inputyMargin * followVal(bezierParams.controlY1Factor, 20);
    const controlX2 = x1 + (x2 - x1) * followVal(bezierParams.controlX2Factor);
    const controlY2 = y2 - outputyMargin * followVal(bezierParams.controlY2Factor, 20);

    return `M${x1},${y1 + inputyMargin} C${controlX1},${controlY1} ${controlX2},${controlY2} ${x2},${y2 - outputyMargin}`;
  };

  return (
    <S.Container
      style={{
        background: isBlack ? "black" : "white",
        color: isBlack ? "white" : "black",
      }}
    >
      {inputTokens.map((token, i) => (
        <S.Token
          key={i}
          style={{
            left: inputWordPosCalc(i)[0],
            top: inputWordPosCalc(i)[1],
            width: inputWordInterval,
            color: isBlack ? "white" : "black", // Dynamic text color
          }}
        >
          {token}
        </S.Token>
      ))}

      {outputTokens.map((token, i) => (
        <SingleOutputToken
          key={i}
          i={i}
          outputWordInterval={outputWordInterval}
          outputWordPosCalc={outputWordPosCalc}
          token={token}
          isBlack={isBlack} // Pass isBlack to control text color
        />
      ))}

      <S.Pic>
        {inputTokens.map((token, i) =>
          outputTokens.map((targetToken, j) => (
            <path
              key={`arc-${i}-${j}`}
              d={createBezierPath(inputWordPosCalc(i)[0], inputWordPosCalc(i)[1], outputWordPosCalc(j)[0], outputWordPosCalc(j)[1])}
              stroke={isBlack ? "white" : "black"}
              fill="none"
              strokeWidth={crossSimilarityMatrix[i][j] > 0.2 ? crossSimilarityMatrix[i][j] ** 3 * 4 : 0}
            />
          ))
        )}
      </S.Pic>
    </S.Container>
  );
}

function SingleOutputToken({ i, outputWordInterval, outputWordPosCalc, token, isBlack }) {
  return (
    <S.Token
      style={{
        left: outputWordPosCalc(i)[0],
        top: outputWordPosCalc(i)[1],
        width: outputWordInterval,
        color: isBlack ? "white" : "black", // Dynamic text color
      }}
    >
      {token}
    </S.Token>
  );
}
