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
}) {
  const observerRef = useRef(null);
  const currentItemObserverRef = useRef(null);

  // Utility functions
  const updateDotPosition = useCallback(
    (index) => {
      const dotHeightPercentage = Math.min((5 / models.length) * 100, 100);
      const positionPercentage =
        (index / (models.length - 1)) * (100 - dotHeightPercentage);
      setDotPosition({ top: positionPercentage, height: dotHeightPercentage });
    },
    [models.length]
  );

  // Model management
  const addMoreModels = useCallback(() => {
    if (isAddingModelsRef.current) return;
    isAddingModelsRef.current = true;

    setModels((prevModels) => {
      const newModels = [...Array(CONSTANTS.NEW_MODELS_COUNT)].map(
        () => initialModels[Math.floor(Math.random() * initialModels.length)]
      );
      const updatedModels = [...prevModels, ...newModels];
      isAddingModelsRef.current = false;
      return updatedModels;
    });
  }, [initialModels]);

  const addModelsToBottom = useCallback(() => addMoreModels(), [addMoreModels]);

  // Observer setup
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) =>
        entries[entries.length - 1].isIntersecting && addModelsToBottom(),
      CONSTANTS.INTERSECTION_OPTIONS
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, [addModelsToBottom]);

  useEffect(() => {
    currentItemObserverRef.current = new IntersectionObserver(
      (entries) => {
        requestAnimationFrame(() => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              const isUserScroll =
                Date.now() - lastInteractionTimeRef.current <
                CONSTANTS.USER_SCROLL_THRESHOLD;
              if (isUserScroll) setIsUserInteraction(true);

              const index = Number(entry.target.getAttribute("data-index"));
              setCurrentIndex(index);
              setManuallySelectedIndex(null);
              updateDotPosition(index);
            }
          });
        });
      },
      {
        ...CONSTANTS.LIST_OBSERVER_OPTIONS,
        root: listRef.current,
        threshold: [0.5], // Only trigger when item is more visible
        rootMargin: "-20% 0px", // Reduce trigger area
      }
    );

    return () => currentItemObserverRef.current?.disconnect();
  }, [
    updateDotPosition,
    setCurrentIndex,
    setManuallySelectedIndex,
    setIsUserInteraction,
  ]);

  // Observer attachment
  useEffect(() => {
    const lastItem = itemRefs.current[itemRefs.current.length - 1];

    if (lastItem && observerRef.current) {
      observerRef.current.observe(lastItem);
    }

    itemRefs.current.forEach((ref) => {
      if (ref && currentItemObserverRef.current) {
        currentItemObserverRef.current.observe(ref);
      }
    });

    return () => {
      [observerRef, currentItemObserverRef].forEach((ref) =>
        ref.current?.disconnect()
      );
    };
  }, [models]);

  return {
    observerRefs: { observerRef, currentItemObserverRef },
    updateDotPosition,
    addModelsToBottom,
  };
}
