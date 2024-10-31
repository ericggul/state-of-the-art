import { useMemo } from "react";
import { useComputeCrossSimlarity } from "../../utils/useComputeSimilarity";

export function useVisualization(newInputEmbeddings, newOutputEmbeddings) {
  const { tokens: inputTokens } = useMemo(
    () => newInputEmbeddings,
    [newInputEmbeddings]
  );
  const { tokens: outputTokens } = useMemo(
    () => newOutputEmbeddings,
    [newOutputEmbeddings]
  );

  const crossSimilarityMatrix = useComputeCrossSimlarity({
    newInputEmbeddings,
    newOutputEmbeddings,
  });

  return {
    inputTokens,
    outputTokens,
    crossSimilarityMatrix,
  };
}
