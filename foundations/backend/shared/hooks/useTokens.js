import { useMemo } from "react";

export function useTokens(newInputEmbeddings, newOutputEmbeddings) {
  const inputTokens = useMemo(
    () => newInputEmbeddings.tokens,
    [newInputEmbeddings]
  );
  const outputTokens = useMemo(
    () => newOutputEmbeddings.tokens,
    [newOutputEmbeddings]
  );

  return { inputTokens, outputTokens };
}
