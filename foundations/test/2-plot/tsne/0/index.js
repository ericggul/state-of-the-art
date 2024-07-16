import * as S from "./styles";
import { useMemo, useEffect, useState } from "react";
import useResize from "@/utils/hooks/useResize";
import tsnejs from "../tsne";

export default function Layer1({ newEmbeddings }) {
  const { embeddings, tokens } = newEmbeddings;
  const [tsneCoords, setTsneCoords] = useState([]);

  const [windowWidth, windowHeight] = useResize();

  // Calculate t-SNE coordinates
  useEffect(() => {
    const tsne = new tsnejs.tSNE({
      dim: 2,
      perplexity: 30,
      epsilon: 10,
    });

    // Initialize t-SNE with embeddings
    tsne.initDataRaw(Object.values(embeddings));

    // Run t-SNE for a fixed number of iterations
    for (let i = 0; i < 500; i++) {
      tsne.step();
    }

    // Get the coordinates
    const coords = tsne.getSolution();

    // Normalize the coordinates
    const xCoords = coords.map((coord) => coord[0]);
    const yCoords = coords.map((coord) => coord[1]);

    const xMin = Math.min(...xCoords);
    const xMax = Math.max(...xCoords);
    const yMin = Math.min(...yCoords);
    const yMax = Math.max(...yCoords);

    const normalizedCoords = coords.map(([x, y]) => [(x - xMin) / (xMax - xMin), (y - yMin) / (yMax - yMin)]);

    setTsneCoords(normalizedCoords);
  }, [embeddings]);

  // Calculate position in SVG space
  const calcSvgPos = (coord) => [coord[0] * windowWidth * 0.5 + windowWidth * 0.25, coord[1] * windowHeight * 0.5 + windowHeight * 0.25];

  return (
    <S.Container>
      <svg width={windowWidth} height={windowHeight}>
        {tsneCoords.map((coord, idx) => {
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
