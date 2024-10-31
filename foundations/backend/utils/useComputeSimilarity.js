import { useMemo, useCallback, useRef, useState, useEffect } from "react";

// Function to calculate dot product of two vectors
function dotProduct(vector1, vector2) {
  return vector1.reduce((sum, value, index) => sum + value * vector2[index], 0);
}

// Function to compute similarity matrix
function computeSimilarityMatrix(embeddings, tokens) {
  const similarityMatrix = tokens.map((_, i) => tokens.map((_, j) => dotProduct(embeddings[tokens[i]], embeddings[tokens[j]])));
  return similarityMatrix;
}

export default function useComputeSimilarity({ newEmbeddings }) {
  const { embeddings, tokens } = newEmbeddings;

  const similarityMatrix = useMemo(() => (embeddings && tokens ? computeSimilarityMatrix(embeddings, tokens) : []), [embeddings, tokens]);

  return similarityMatrix;
}

export function useComputeCrossSimlarity({ newInputEmbeddings, newOutputEmbeddings }) {
  const { embeddings: inputEmbeddings, tokens: inputTokens } = newInputEmbeddings;
  const { embeddings: outputEmbeddings, tokens: outputTokens } = newOutputEmbeddings;

  const similarityMatrix = useMemo(() => {
    const similarityMatrix = inputTokens.map((_, i) => outputTokens.map((_, j) => dotProduct(inputEmbeddings[inputTokens[i]], outputEmbeddings[outputTokens[j]])));
    return similarityMatrix;
  }, [inputEmbeddings, outputEmbeddings, inputTokens, outputTokens]);

  return similarityMatrix;
}

export function useComputeMultiCrossSimlarity({ newMultiEmbeddings }) {
  const embeddingsArr = useMemo(() => newMultiEmbeddings.map((embeddings) => embeddings.embeddings), [newMultiEmbeddings]);
  const tokensArr = useMemo(() => newMultiEmbeddings.map((embeddings) => embeddings.tokens), [newMultiEmbeddings]);

  const multiSimilarityMatrix = useMemo(() => {
    const result = [];
    for (let i = 0; i < embeddingsArr.length - 1; i++) {
      const thisEl = i;
      const nextEl = i + 1;

      const similarityMatrix = tokensArr[thisEl].map((_, i) => tokensArr[nextEl].map((_, j) => dotProduct(embeddingsArr[thisEl][tokensArr[thisEl][i]], embeddingsArr[nextEl][tokensArr[nextEl][j]])));
      result.push(similarityMatrix);
    }
    return result;
  }, [embeddingsArr, tokensArr]);

  console.log(multiSimilarityMatrix);

  return multiSimilarityMatrix;
}
