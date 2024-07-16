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
