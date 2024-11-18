import { useState, useRef, useMemo, useCallback, useEffect } from "react";

const INTERSECTION_OPTIONS = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const LIST_OBSERVER_OPTIONS = {
  rootMargin: "-50% 0px -50% 0px",
  threshold: 0,
};

const NEW_MODELS_COUNT = 10;

export function useModelListLogic({ initialModels, socket, mobileId }) {
  const [models, setModels] = useState(initialModels);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [manuallySelectedIndex, setManuallySelectedIndex] = useState(null);
  const [dotPosition, setDotPosition] = useState(0);

  // Refs
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const observerRef = useRef(null);
  const currentItemObserverRef = useRef(null);

  // Memoized values
  const activeIndex = useMemo(
    () => manuallySelectedIndex ?? currentIndex,
    [manuallySelectedIndex, currentIndex]
  );

  // Memoized callbacks
  const addMoreModels = useCallback(() => {
    setModels((prevModels) => [
      ...prevModels,
      ...[...Array(NEW_MODELS_COUNT)].map(
        () => initialModels[Math.floor(Math.random() * initialModels.length)]
      ),
    ]);
  }, [initialModels]);

  const handleItemClick = useCallback((index) => {
    setManuallySelectedIndex((prev) => (prev === index ? null : index));
  }, []);

  const isCurrentItem = useCallback(
    (index) =>
      manuallySelectedIndex === index ||
      (manuallySelectedIndex === null && currentIndex === index),
    [manuallySelectedIndex, currentIndex]
  );

  const updateDotPosition = useCallback(
    (index) => {
      setDotPosition((index / (models.length - 1)) * 100);
    },
    [models.length]
  );

  // Socket emission effect
  useEffect(() => {
    if (activeIndex === null || !socket?.current) return;

    const activeModel = models[activeIndex];
    try {
      socket.current.emit("mobile-new-architecture", {
        currentArchitectures: [activeModel],
        mobileId,
      });

      if (activeModel.explanation) {
        socket.current.emit("mobile-new-speech", {
          text: `${activeModel.name} ${activeModel.explanation}`,
          mobileId,
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeIndex, models, socket, mobileId]);

  // Observer effects
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[entries.length - 1].isIntersecting) {
        addMoreModels();
      }
    }, INTERSECTION_OPTIONS);

    return () => observerRef.current?.disconnect();
  }, [addMoreModels]);

  useEffect(() => {
    currentItemObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setCurrentIndex(index);
            setManuallySelectedIndex(null);
            updateDotPosition(index);
          }
        });
      },
      { ...LIST_OBSERVER_OPTIONS, root: listRef.current }
    );

    return () => currentItemObserverRef.current?.disconnect();
  }, [updateDotPosition]);

  useEffect(() => {
    const lastItemRef = itemRefs.current[itemRefs.current.length - 1];
    if (lastItemRef && observerRef.current) {
      observerRef.current.observe(lastItemRef);
    }

    itemRefs.current.forEach((ref) => {
      if (ref && currentItemObserverRef.current) {
        currentItemObserverRef.current.observe(ref);
      }
    });

    return () => {
      observerRef.current?.disconnect();
      currentItemObserverRef.current?.disconnect();
    };
  }, [models]);

  return {
    models,
    activeIndex,
    dotPosition,
    listRef,
    itemRefs,
    handleItemClick,
    isCurrentItem,
  };
}
