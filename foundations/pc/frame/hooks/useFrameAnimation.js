import { useCallback } from "react";

export function useFrameAnimation() {
  const handleAnimation = useCallback(
    (lastUpdateRef, setIsAnimating, setShouldRender, setLineKey) => {
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdateRef.current;

      if (timeSinceLastUpdate < 100) {
        setIsAnimating(false);
        return;
      }

      setShouldRender(false);
      requestAnimationFrame(() => {
        setShouldRender(true);
        setIsAnimating(true);
        setLineKey((prev) => prev + 1);
      });

      lastUpdateRef.current = now;
    },
    []
  );

  return handleAnimation;
}
