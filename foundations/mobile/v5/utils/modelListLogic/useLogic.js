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

  const { observerRefs, updateDotPosition, addModelsToTop, addModelsToBottom } =
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

  useInitialScroll({ listRef });

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

  // Add scroll momentum control
  useEffect(() => {
    const listElement = listRef.current;
    if (!listElement) return;

    let lastScrollTop = 0;
    let scrollVelocity = 0;

    const handleScroll = (e) => {
      const currentScrollTop = listElement.scrollTop;
      const delta = currentScrollTop - lastScrollTop;

      if (Math.abs(delta) > CONSTANTS.SCROLL_MOMENTUM.threshold) {
        scrollVelocity =
          Math.min(Math.abs(delta), CONSTANTS.SCROLL_MOMENTUM.maxSpeed) *
          Math.sign(delta);

        listElement.scrollTop =
          lastScrollTop + scrollVelocity * CONSTANTS.SCROLL_MOMENTUM.multiplier;
      }

      lastScrollTop = listElement.scrollTop;
    };

    listElement.addEventListener("scroll", handleScroll, { passive: true });
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
