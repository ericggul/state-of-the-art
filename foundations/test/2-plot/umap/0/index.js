import * as S from "./styles";
import { useMemo, useEffect, useState } from "react";
import useResize from "@/utils/hooks/useResize";
import { UMAP } from "umap-js";

export default function Layer1({ newEmbeddings }) {
  const { embeddings, tokens } = newEmbeddings;
  const [umapCoords, setUmapCoords] = useState([]);

  const [windowWidth, windowHeight] = useResize();

  // Calculate UMAP coordinates
  useEffect(() => {
    const umap = new UMAP({
      nNeighbors: 10,
      minDist: 0.1,
    });

    // Initialize UMAP with embeddings
    const fit = umap.fit(Object.values(embeddings));

    // Normalize the coordinates
    const xCoords = fit.map((coord) => coord[0]);
    const yCoords = fit.map((coord) => coord[1]);

    const xMin = Math.min(...xCoords);
    const xMax = Math.max(...xCoords);
    const yMin = Math.min(...yCoords);
    const yMax = Math.max(...yCoords);

    const normalizedCoords = fit.map(([x, y]) => [(x - xMin) / (xMax - xMin), (y - yMin) / (yMax - yMin)]);

    setUmapCoords(normalizedCoords);
  }, [embeddings]);

  // Calculate position in SVG space
  const calcSvgPos = (coord) => [coord[0] * windowWidth * 0.5 + windowWidth * 0.25, coord[1] * windowHeight * 0.5 + windowHeight * 0.25];

  return (
    <S.Container>
      <svg width={windowWidth} height={windowHeight}>
        {umapCoords.map((coord, idx) => {
          const [x, y] = calcSvgPos(coord);
          return (
            <g key={idx}>
              <circle cx={x} cy={y} r={5} fill="white" />
              <text x={x + 10} y={y} fill="white" fontSize="0.8vw">
                {tokens[idx]}
              </text>
            </g>
          );
        })}
      </svg>
    </S.Container>
  );
}
