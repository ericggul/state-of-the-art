import * as S from "./styles";
import usePosCalc from "./usePosCalc";
import { useComputeCrossSimlarity } from "@/foundations/test/1-relation/utils/useComputeSimilarity";

export default function Layer1({ newInputEmbeddings, newOutputEmbeddings }) {
  const { embeddings: inputEmbeddings, tokens: inputTokens } = newInputEmbeddings;
  const { embeddings: outputEmbeddings, tokens: outputTokens } = newOutputEmbeddings;
  const crossSimilarityMatrix = useComputeCrossSimlarity({
    newInputEmbeddings,
    newOutputEmbeddings,
  });

  const { wordPosCalc: inputWordPosCalc, yMargin: inputyMargin } = usePosCalc({ tokens: inputTokens, type: "input" });
  const { wordPosCalc: outputWordPosCalc, yMargin: outputyMargin } = usePosCalc({ tokens: outputTokens, type: "output" });

  const bezierParams = {
    controlX1Factor: 0,
    controlX2Factor: 1,
    controlY1Factor: 10,
    controlY2Factor: 5,
  };

  // Function to create a cubic Bezier curve path between two points
  const createBezierPath = (x1, y1, x2, y2) => {
    const controlX1 = x1 + (x2 - x1) * bezierParams.controlX1Factor;
    const controlY1 = y1 + inputyMargin * bezierParams.controlY1Factor;
    const controlX2 = x1 + (x2 - x1) * bezierParams.controlX2Factor;
    const controlY2 = y2 - outputyMargin * bezierParams.controlY2Factor;

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
            width: "auto", // Keep this as per your original code
          }}
        >
          {token}
        </S.Token>
      ))}

      {outputTokens.map((token, i) => (
        <S.Token
          key={i}
          style={{
            left: outputWordPosCalc(i)[0],
            top: outputWordPosCalc(i)[1],
            width: "auto", // Keep this as per your original code
          }}
        >
          {token}
        </S.Token>
      ))}

      <S.Pic>
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
