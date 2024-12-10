import { useRef, useCallback, useEffect, useState } from "react";
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

    setShowLoading(true);

    // Force a 2-second delay
    setTimeout(() => {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        setModels((prevModels) => {
          // Reduce batch size for better performance
          const batchSize = CONSTANTS.NEW_MODELS_COUNT;
          const newModels = [...Array(batchSize)].map(
            () =>
              initialModels[Math.floor(Math.random() * initialModels.length)]
          );

          // Clean up refs for removed items
          itemRefs.current = itemRefs.current.slice(
            0,
            prevModels.length + batchSize
          );

          isAddingModelsRef.current = false;
          setShowLoading(false);
          return [...prevModels, ...newModels];
        });
      });
    }, 2000); // 2-second delay
  }, [initialModels, setModels, setShowLoading]);

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
        // Use requestIdleCallback when available
        const schedule = window.requestIdleCallback || requestAnimationFrame;

        schedule(() => {
          const entry = entries[entries.length - 1];
          if (entry?.isIntersecting && entry.intersectionRatio > 0.5) {
            const index = Number(entry.target.getAttribute("data-index"));
            setCurrentIndex(index);
            setManuallySelectedIndex(null);
            updateDotPosition(index);
          }
        });
      },
      {
        ...CONSTANTS.LIST_OBSERVER_OPTIONS,
        root: listRef.current,
        threshold: [0.5],
        rootMargin: "-20% 0px",
      }
    );

    return () => currentItemObserverRef.current?.disconnect();
  }, [updateDotPosition, setCurrentIndex, setManuallySelectedIndex]);

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
