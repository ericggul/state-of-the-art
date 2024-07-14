import * as S from "./styles";
import { useMemo } from "react";

// Function to calculate dot product of two vectors
function dotProduct(vector1, vector2) {
  return vector1.reduce((sum, value, index) => sum + value * vector2[index], 0);
}

// Function to compute similarity matrix
function computeSimilarityMatrix(embeddings, tokens) {
  const similarityMatrix = tokens.map((_, i) => tokens.map((_, j) => dotProduct(embeddings[tokens[i]], embeddings[tokens[j]])));
  return similarityMatrix;
}

export default function Layer1({ newEmbeddings }) {
  const { embeddings, tokens } = newEmbeddings;

  // Compute similarity matrix using useMemo to memoize the computation
  const similarityMatrix = useMemo(() => computeSimilarityMatrix(embeddings, tokens), [embeddings, tokens]);

  console.log(similarityMatrix);

  return (
    <S.Container>
      <S.Table>
        <thead>
          <tr>
            <th></th>
            {tokens.map((token, i) => (
              <th key={i}>{token}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {similarityMatrix.map((row, i) => (
            <tr key={i}>
              <th>{tokens[i]}</th>
              {row.map((value, j) => (
                <td key={j}>{value.toFixed(3)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </S.Table>
    </S.Container>
  );
}
