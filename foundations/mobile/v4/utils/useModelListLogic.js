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

const NEW_MODELS_COUNT = 37;
const INITIAL_SCROLL_ITEMS = 100;

export function useModelListLogic({ initialModels, socket, mobileId }) {
  // States
  const [models, setModels] = useState(initialModels);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [manuallySelectedIndex, setManuallySelectedIndex] = useState(null);
  const [dotPosition, setDotPosition] = useState({ top: 0, height: 0 });
  const [isUserInteraction, setIsUserInteraction] = useState(false);
  const [isInitialScrollComplete, setIsInitialScrollComplete] = useState(false);

  // Refs
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const observerRef = useRef(null);
  const currentItemObserverRef = useRef(null);
  const userScrollRef = useRef(false);
  const lastInteractionTimeRef = useRef(0);
  const topObserverRef = useRef(null);
  const isAddingModelsRef = useRef(false);
  const scrollAnimationRef = useRef(null);
  const initialScrollTimeoutRef = useRef(null);

  // Define handleUserInteraction first
  const handleUserInteraction = useCallback(() => {
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }
    if (initialScrollTimeoutRef.current) {
      clearTimeout(initialScrollTimeoutRef.current);
      initialScrollTimeoutRef.current = null;
    }
    setIsInitialScrollComplete(true);
    userScrollRef.current = true;
    lastInteractionTimeRef.current = Date.now();
  }, []);

  // Memoized values
  const activeIndex = useMemo(
    () => manuallySelectedIndex ?? currentIndex,
    [manuallySelectedIndex, currentIndex]
  );

  // Memoized callbacks
  const addMoreModels = useCallback(
    (direction = "bottom") => {
      if (isAddingModelsRef.current) return;
      isAddingModelsRef.current = true;

      setModels((prevModels) => {
        const newModels = [...Array(NEW_MODELS_COUNT)].map(
          () => initialModels[Math.floor(Math.random() * initialModels.length)]
        );

        // Store current scroll position
        const listElement = listRef.current;
        const scrollTop = listElement?.scrollTop;
        const scrollHeight = listElement?.scrollHeight;

        // Add models to top or bottom
        const updatedModels =
          direction === "top"
            ? [...newModels, ...prevModels]
            : [...prevModels, ...newModels];

        // Restore scroll position for top additions
        if (direction === "top" && listElement && scrollTop !== undefined) {
          requestAnimationFrame(() => {
            const newScrollHeight = listElement.scrollHeight;
            listElement.scrollTop =
              scrollTop + (newScrollHeight - scrollHeight);
          });
        }

        isAddingModelsRef.current = false;
        return updatedModels;
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

  const handleItemClick = useCallback(
    (index) => {
      handleUserInteraction();
      setIsUserInteraction(true);
      setManuallySelectedIndex((prev) => (prev === index ? null : index));
    },
    [handleUserInteraction]
  );

  const isCurrentItem = useCallback(
    (index) =>
      manuallySelectedIndex === index ||
      (manuallySelectedIndex === null && currentIndex === index),
    [manuallySelectedIndex, currentIndex]
  );

  const updateDotPosition = useCallback(
    (index) => {
      // Calculate dot height percentage (5 visible items / total items)
      const dotHeightPercentage = Math.min((5 / models.length) * 100, 100);
      // Calculate position percentage
      const positionPercentage =
        (index / (models.length - 1)) * (100 - dotHeightPercentage);

      setDotPosition({
        top: positionPercentage,
        height: dotHeightPercentage,
      });
    },
    [models.length]
  );

  // Socket emission effect
  useEffect(() => {
    if (activeIndex === null || !socket?.current || !isUserInteraction) return;

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
  }, [activeIndex, models, socket, mobileId, isUserInteraction]);

  // Observer effects
  useEffect(() => {
    // Bottom observer
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[entries.length - 1].isIntersecting) {
        addModelsToBottom();
      }
    }, INTERSECTION_OPTIONS);

    // Top observer
    topObserverRef.current = new IntersectionObserver((entries) => {
      if (entries[entries.length - 1].isIntersecting) {
        addModelsToTop();
      }
    }, INTERSECTION_OPTIONS);

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
            const now = Date.now();
            const isUserScroll = now - lastInteractionTimeRef.current < 100; // 100ms threshold

            if (isUserScroll) {
              setIsUserInteraction(true);
            }

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
    const firstItemRef = itemRefs.current[0];
    const lastItemRef = itemRefs.current[itemRefs.current.length - 1];

    if (firstItemRef && topObserverRef.current) {
      topObserverRef.current.observe(firstItemRef);
    }

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
      topObserverRef.current?.disconnect();
      currentItemObserverRef.current?.disconnect();
    };
  }, [models]);

  // Start initial scroll animation
  useEffect(() => {
    const listElement = listRef.current;
    if (!listElement || isInitialScrollComplete) return;

    // Wait a bit for layout to settle
    setTimeout(() => {
      const itemHeight = listElement.children[0]?.offsetHeight || 0;
      const targetScroll = itemHeight * INITIAL_SCROLL_ITEMS;

      listElement.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });

      // Mark as complete after animation (roughly 1 second)
      setTimeout(() => {
        setIsInitialScrollComplete(true);
      }, 1000);
    }, 500);

    return () => {
      setIsInitialScrollComplete(true); // Ensure we cleanup properly
    };
  }, []); // Empty dependency array - run once on mount

  // Stop animation on user interaction
  useEffect(() => {
    const listElement = listRef.current;

    if (listElement) {
      listElement.addEventListener("scroll", handleUserInteraction, {
        passive: true,
      });
      listElement.addEventListener("touchstart", handleUserInteraction, {
        passive: true,
      });
      listElement.addEventListener("mousedown", handleUserInteraction, {
        passive: true,
      });
    }

    return () => {
      if (listElement) {
        listElement.removeEventListener("scroll", handleUserInteraction);
        listElement.removeEventListener("touchstart", handleUserInteraction);
        listElement.removeEventListener("mousedown", handleUserInteraction);
      }
    };
  }, [handleUserInteraction]);

  // Reset user interaction flag when models change
  useEffect(() => {
    setIsUserInteraction(false);
  }, [models]);

  return {
    models,
    activeIndex,
    dotPosition,
    listRef,
    itemRefs,
    handleItemClick,
    isCurrentItem,
    isInitialScrollComplete,
  };
}
