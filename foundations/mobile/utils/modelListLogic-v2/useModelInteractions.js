import { useCallback } from "react";

export function useModelInteractions({
  lastInteractionTimeRef,
  setIsUserInteraction,
  setManuallySelectedIndex,
  manuallySelectedIndex,
  currentIndex,
}) {
  const handleUserInteraction = useCallback(() => {
    lastInteractionTimeRef.current = Date.now();
    setIsUserInteraction(true);
  }, [lastInteractionTimeRef, setIsUserInteraction]);

  const handleItemClick = useCallback(
    (index) => {
      handleUserInteraction();
      setManuallySelectedIndex((prev) => (prev === index ? null : index));
    },
    [handleUserInteraction, setManuallySelectedIndex]
  );

  const isCurrentItem = useCallback(
    (index) =>
      manuallySelectedIndex === index ||
      (manuallySelectedIndex === null && currentIndex === index),
    [manuallySelectedIndex, currentIndex]
  );

  return { handleUserInteraction, handleItemClick, isCurrentItem };
}
