import { useState, useRef, useMemo, useEffect } from "react";
import { useModelObservers } from "./useModelObservers";
import { useModelInteractions } from "./useModelInteractions";
import { useInitialScroll } from "./useInitialScroll";
import { useSocketCommunication } from "./useSocketCommunication";
import { CONSTANTS } from "./constants";

export function useModelListLogic({ initialModels, socket, mobileId }) {
  // States
  const [models, setModels] = useState(initialModels);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [manuallySelectedIndex, setManuallySelectedIndex] = useState(null);
  const [dotPosition, setDotPosition] = useState({ top: 0, height: 0 });
  const [isUserInteraction, setIsUserInteraction] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);

  // Refs
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const lastInteractionTimeRef = useRef(0);
  const isAddingModelsRef = useRef(false);

  const activeIndex = useMemo(
    () => manuallySelectedIndex ?? currentIndex,
    [manuallySelectedIndex, currentIndex]
  );

  const { observerRefs, updateDotPosition, addModelsToBottom } =
    useModelObservers({
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
    });

  const { handleUserInteraction, handleItemClick, isCurrentItem } =
    useModelInteractions({
      lastInteractionTimeRef,
      setIsUserInteraction,
      setManuallySelectedIndex,
      manuallySelectedIndex,
      currentIndex,
    });

  // useInitialScroll({ listRef });

  useSocketCommunication({
    activeIndex,
    models,
    socket,
    mobileId,
    isUserInteraction,
  });

  // User interaction events
  useEffect(() => {
    const listElement = listRef.current;
    if (!listElement) return;

    const events = ["scroll", "touchstart", "mousedown"];
    events.forEach((event) =>
      listElement.addEventListener(event, handleUserInteraction, {
        passive: true,
      })
    );

    return () =>
      events.forEach((event) =>
        listElement.removeEventListener(event, handleUserInteraction)
      );
  }, [handleUserInteraction]);

  // Scroll hint timer
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowScrollHint(false);
    }, CONSTANTS.SCROLL_HINT_DURATION);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const listElement = listRef.current;
    if (!listElement) return;

    let lastScrollTime = Date.now();
    let lastScrollTop = listElement.scrollTop;

    const handleScroll = (e) => {
      const currentTime = Date.now();
      const currentScrollTop = listElement.scrollTop;
      const timeDelta = currentTime - lastScrollTime;

      // Calculate scroll speed (pixels per millisecond)
      const scrollSpeed =
        Math.abs(currentScrollTop - lastScrollTop) / timeDelta;
      const maxSpeed = CONSTANTS.MAX_SCROLL_SPEED; // Increased from 2 to 8 for faster scrolling

      if (scrollSpeed > maxSpeed) {
        // Limit the scroll position
        const maxScrollDelta = maxSpeed * timeDelta;
        const direction = currentScrollTop > lastScrollTop ? 1 : -1;
        listElement.scrollTop = lastScrollTop + maxScrollDelta * direction;
        e.preventDefault();
      }

      lastScrollTime = currentTime;
      lastScrollTop = listElement.scrollTop;
    };

    listElement.addEventListener("scroll", handleScroll, { passive: false });
    return () => listElement.removeEventListener("scroll", handleScroll);
  }, []);

  return {
    models,
    activeIndex,
    dotPosition,
    listRef,
    itemRefs,
    handleItemClick,
    isCurrentItem,
    showScrollHint,
  };
}

export { CONSTANTS };
