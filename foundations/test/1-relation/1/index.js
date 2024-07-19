import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as d3 from "d3";
import * as S from "./styles";
import useResize from "@/utils/hooks/useResize";
import useComputeSimilarity from "../utils/useComputeSimilarity";

export default function Layer1({ newEmbeddings }) {
  const { embeddings, tokens } = newEmbeddings;
  const similarityMatrix = useComputeSimilarity({ newEmbeddings });

  const [windowWidth, windowHeight] = useResize();
  const wordLength = useMemo(() => tokens.length, [tokens]);
  const wordInterval = useMemo(() => Math.min(0.05 * windowWidth, (windowWidth * 0.9) / wordLength), [windowWidth, wordLength]);
  const yMargin = useMemo(() => windowHeight * 0.02, [windowHeight]);

  const [targetWordIdx, setTargetWordIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTargetWordIdx((prev) => (prev + 1) % wordLength);
    }, 400);

    return () => clearInterval(interval);
  }, [wordLength]);

  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous contents

    const wordPosCalc = (idx) => [windowWidth / 2 - ((wordLength - 1) * wordInterval) / 2 + idx * wordInterval, windowHeight / 2];

    // Function to create an arc path between two points
    const createArcPath = (x1, y1, x2, y2, dir = 1) => {
      const radius = Math.abs(x2 - x1) / 2;
      const sweepFlag = dir;
      const y1Adjusted = y1 + (dir === 1 ? -1 : 1) * yMargin;
      const y2Adjusted = y2 + (dir === 1 ? -1 : 1) * yMargin;
      return `M${x1} ${y1Adjusted} A${radius} ${radius * 0.6} 0 0 ${sweepFlag} ${x2} ${y2Adjusted}`;
    };

    tokens.forEach((token, i) => {
      tokens.forEach((targetToken, j) => {
        if (i < j) {
          const pathData = createArcPath(wordPosCalc(i)[0], wordPosCalc(i)[1], wordPosCalc(j)[0], wordPosCalc(j)[1], j % 2 === 0 ? 1 : 0);

          svg
            .append("path")
            .attr("d", pathData)
            .attr("stroke", "white")
            .attr("fill", "none")
            .attr("stroke-width", similarityMatrix[i][j] > 0.2 ? similarityMatrix[i][j] ** 2 * 4 : 0)
            .attr("opacity", j === targetWordIdx || i === targetWordIdx ? 1 : 0.1);
        }
      });
    });

    tokens.forEach((token, i) => {
      const [x, y] = wordPosCalc(i);
      svg.append("text").attr("x", x).attr("y", y).attr("fill", "white").attr("text-anchor", "middle").attr("alignment-baseline", "middle").text(token);
    });
  }, [tokens, similarityMatrix, windowWidth, windowHeight, wordInterval, yMargin, targetWordIdx]);

  return <svg ref={svgRef} width={windowWidth} height={windowHeight} />;
}
