import { useState, useRef, useMemo, useEffect } from "react";
import { useModelObservers } from "./useModelObservers";
import { useModelInteractions } from "./useModelInteractions";
import { useInitialScroll } from "./useInitialScroll";
import { useSocketCommunication } from "./useSocketCommunication";
import { CONSTANTS } from "./constants";

const SCROLL_THROTTLE_MS = 16; // Approximately 60fps

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

  // Optimize scroll handling
  useEffect(() => {
    const listElement = listRef.current;
    if (!listElement) return;

    let lastScrollTime = Date.now();
    let lastScrollTop = listElement.scrollTop;
    let rafId = null;

    const handleScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const currentTime = Date.now();
        const currentScrollTop = listElement.scrollTop;

        if (currentTime - lastScrollTime >= SCROLL_THROTTLE_MS) {
          const timeDelta = currentTime - lastScrollTime;
          const scrollSpeed =
            Math.abs(currentScrollTop - lastScrollTop) / timeDelta;
          const maxSpeed = CONSTANTS.MAX_SCROLL_SPEED;

          if (scrollSpeed > maxSpeed) {
            const maxScrollDelta = maxSpeed * timeDelta;
            const direction = currentScrollTop > lastScrollTop ? 1 : -1;
            listElement.scrollTop = lastScrollTop + maxScrollDelta * direction;
          }

          lastScrollTime = currentTime;
          lastScrollTop = listElement.scrollTop;
        }

        rafId = null;
      });
    };

    listElement.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      listElement.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
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
