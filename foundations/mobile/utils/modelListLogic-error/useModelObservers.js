import { useRef, useCallback, useEffect } from "react";
import { CONSTANTS } from "./constants";

export function useModelObservers({
  models,
  setModels,
  initialModels,
  listRef,
  itemRefs,
  isAddingModelsRef,
  setCurrentIndex,
  setManuallySelectedIndex,
  lastInteractionTimeRef,
  setIsUserInteraction,
  setDotPosition,
  setShowLoading,
  outerRef,
}) {
  const updateDotPosition = useCallback(
    (index) => {
      const dotHeightPercentage = Math.min((5 / models.length) * 100, 100);
      const positionPercentage =
        (index / (models.length - 1)) * (100 - dotHeightPercentage);
      setDotPosition({ top: positionPercentage, height: dotHeightPercentage });
    },
    [models.length, setDotPosition]
  );

  useEffect(() => {
    const scrollElement = outerRef.current;
    if (!scrollElement) return;

    const handleScroll = (event) => {
      const scrollTop = event.target.scrollTop;
      // Use the expanded item height for current items
      const baseItemHeight = 60; // Default height
      const expandedItemHeight = 200; // Height when expanded

      // Calculate current index considering variable heights
      let accumulatedHeight = 0;
      let currentIndex = 0;

      for (let i = 0; i < models.length; i++) {
        const itemHeight =
          i === currentIndex ? expandedItemHeight : baseItemHeight;
        if (accumulatedHeight + itemHeight > scrollTop) {
          currentIndex = i;
          break;
        }
        accumulatedHeight += itemHeight;
      }

      lastInteractionTimeRef.current = Date.now();
      setIsUserInteraction(true);

      setCurrentIndex(currentIndex);
      setManuallySelectedIndex(null); // Reset manual selection on scroll
      updateDotPosition(currentIndex);

      // Load more models when near the end
      if (currentIndex + CONSTANTS.LOAD_MORE_THRESHOLD >= models.length) {
        if (!isAddingModelsRef.current) {
          setShowLoading(true);
          isAddingModelsRef.current = true;

          setTimeout(() => {
            setModels((prevModels) => [
              ...prevModels,
              ...initialModels.slice(0, CONSTANTS.NEW_MODELS_COUNT),
            ]);
            isAddingModelsRef.current = false;
            setShowLoading(false);
          }, 500);
        }
      }
    };

    scrollElement.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, [
    models.length,
    setCurrentIndex,
    setManuallySelectedIndex,
    updateDotPosition,
    setModels,
    initialModels,
    isAddingModelsRef,
    setShowLoading,
    lastInteractionTimeRef,
    setIsUserInteraction,
    outerRef,
  ]);

  return {
    updateDotPosition,
  };
}
