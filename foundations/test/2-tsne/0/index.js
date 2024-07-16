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
    setTsneCoords(coords);
  }, [embeddings]);

  // Calculate position in SVG space
  const calcSvgPos = (coord) => [(coord[0] + 1) * (windowWidth / 2), (coord[1] + 1) * (windowHeight / 2)];

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
