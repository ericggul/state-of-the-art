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

  const similarityMatrix = useMemo(() => computeSimilarityMatrix(embeddings, tokens), [embeddings, tokens]);

  return (
    <S.Container>
      <S.TopRow>
        <S.Token />
        {tokens.map((token, i) => (
          <S.Value key={i}>{token}</S.Value>
        ))}
      </S.TopRow>
      {similarityMatrix.map((row, i) => (
        <S.Row key={i}>
          <S.Token>{tokens[i]}</S.Token>
          {row.map((value, j) => (
            <S.Value
              key={j}
              style={{
                opacity: value,
              }}
            >
              {value.toFixed(3)}
            </S.Value>
          ))}
        </S.Row>
      ))}
    </S.Container>
  );
}
