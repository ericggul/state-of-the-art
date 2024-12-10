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
    let timeoutId, rafId;

    // Pre-calculate new models outside of RAF for better performance
    const batchSize = CONSTANTS.NEW_MODELS_COUNT;
    const newModels = Array.from(
      { length: batchSize },
      () => initialModels[Math.floor(Math.random() * initialModels.length)]
    );

    timeoutId = setTimeout(() => {
      rafId = requestAnimationFrame(() => {
        setModels((prevModels) => {
          itemRefs.current = itemRefs.current.slice(
            0,
            prevModels.length + batchSize
          );

          isAddingModelsRef.current = false;
          setShowLoading(false);
          return [...prevModels, ...newModels];
        });
      });
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
      if (isAddingModelsRef.current) {
        isAddingModelsRef.current = false;
        setShowLoading(false);
      }
    };
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
    let scheduleId;

    currentItemObserverRef.current = new IntersectionObserver(
      (entries) => {
        // Cancel any pending callbacks
        if (scheduleId) {
          if (window.requestIdleCallback) {
            cancelIdleCallback(scheduleId);
          } else {
            cancelAnimationFrame(scheduleId);
          }
        }

        const schedule = window.requestIdleCallback || requestAnimationFrame;
        scheduleId = schedule(() => {
          const entry = entries[entries.length - 1];
          if (entry?.isIntersecting && entry.intersectionRatio > 0.5) {
            const index = Number(entry.target.getAttribute("data-index"));
            setCurrentIndex(index);
            setManuallySelectedIndex(null);
            updateDotPosition(index);
          }
          scheduleId = null;
        });
      },
      {
        ...CONSTANTS.LIST_OBSERVER_OPTIONS,
        root: listRef.current,
        threshold: [0.5],
        rootMargin: "-20% 0px",
      }
    );

    return () => {
      currentItemObserverRef.current?.disconnect();
      if (scheduleId) {
        if (window.requestIdleCallback) {
          cancelIdleCallback(scheduleId);
        } else {
          cancelAnimationFrame(scheduleId);
        }
      }
    };
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
