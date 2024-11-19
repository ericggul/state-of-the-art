import { useRef, useCallback, useEffect } from "react";
import { CONSTANTS } from "./constants";
import { debounce } from "lodash";

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
  const topObserverRef = useRef(null);

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
  const addMoreModels = useCallback(
    (direction = "bottom") => {
      if (isAddingModelsRef.current) return;
      isAddingModelsRef.current = true;

      // Batch updates to reduce re-renders
      requestAnimationFrame(() => {
        setModels((prevModels) => {
          const newModels = [...Array(CONSTANTS.NEW_MODELS_COUNT)].map(
            () =>
              initialModels[Math.floor(Math.random() * initialModels.length)]
          );

          const updatedModels =
            direction === "top"
              ? [...newModels, ...prevModels]
              : [...prevModels, ...newModels];

          isAddingModelsRef.current = false;
          return updatedModels;
        });
      });
    },
    [initialModels]
  );

  const addModelsToTop = useCallback(
    () => addMoreModels("top"),
    [addMoreModels]
  );
  const addModelsToBottom = useCallback(
    () => addMoreModels("bottom"),
    [addMoreModels]
  );

  const debouncedAddModels = useCallback(
    debounce((direction) => {
      addMoreModels(direction);
    }, 150),
    [addMoreModels]
  );

  // Observer setup
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) =>
        entries[entries.length - 1].isIntersecting && addModelsToBottom(),
      CONSTANTS.INTERSECTION_OPTIONS
    );

    topObserverRef.current = new IntersectionObserver(
      (entries) =>
        entries[entries.length - 1].isIntersecting && addModelsToTop(),
      CONSTANTS.INTERSECTION_OPTIONS
    );

    return () => {
      observerRef.current?.disconnect();
      topObserverRef.current?.disconnect();
    };
  }, [addModelsToTop, addModelsToBottom]);

  useEffect(() => {
    currentItemObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
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
      },
      { ...CONSTANTS.LIST_OBSERVER_OPTIONS, root: listRef.current }
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
    const [firstItem, lastItem] = [
      itemRefs.current[0],
      itemRefs.current[itemRefs.current.length - 1],
    ];

    if (firstItem && topObserverRef.current)
      topObserverRef.current.observe(firstItem);
    if (lastItem && observerRef.current) observerRef.current.observe(lastItem);

    itemRefs.current.forEach((ref) => {
      if (ref && currentItemObserverRef.current) {
        currentItemObserverRef.current.observe(ref);
      }
    });

    return () => {
      [observerRef, topObserverRef, currentItemObserverRef].forEach((ref) =>
        ref.current?.disconnect()
      );
    };
  }, [models]);

  return {
    observerRefs: { observerRef, currentItemObserverRef, topObserverRef },
    updateDotPosition,
    addModelsToTop,
    addModelsToBottom,
  };
}
