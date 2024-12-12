import { useState, useRef, useMemo, useEffect } from "react";
import { useModelObservers } from "./useModelObservers";
import { useModelInteractions } from "./useModelInteractions";
import { useInitialScroll } from "./useInitialScroll";
import { useSocketCommunication } from "./useSocketCommunication";
import { CONSTANTS } from "./constants";

const SCROLL_THROTTLE_MS = 16;

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isAndroid = /Android/.test(navigator.userAgent);

const MOMENTUM_CONFIG = {
  friction: isIOS ? 0.92 : 0.94,
  multiplier: isIOS ? 0.35 : 0.3,
  minVelocity: isIOS ? 0.05 : 0.03,
  smoothingFactor: 0.2,
  maxVelocity: 50,
};

export function useModelListLogic({
  initialModels,
  socket,
  mobileId,
  outerRef,
  itemRefs,
  listRef,
}) {
  const [models, setModels] = useState(initialModels);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [manuallySelectedIndex, setManuallySelectedIndex] = useState(null);
  const [dotPosition, setDotPosition] = useState({ top: 0, height: 0 });
  const [isUserInteraction, setIsUserInteraction] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [showResetCountdown, setShowResetCountdown] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(30);
  const [showLoading, setShowLoading] = useState(false);

  const countdownTimerRef = useRef(null);
  const lastIndexChangeTimeRef = useRef(Date.now());
  const lastInteractionTimeRef = useRef(0);
  const isAddingModelsRef = useRef(false);

  const activeIndex = useMemo(
    () => manuallySelectedIndex ?? currentIndex,
    [manuallySelectedIndex, currentIndex]
  );

  const { updateDotPosition } = useModelObservers({
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
  });

  const { handleUserInteraction, handleItemClick, isCurrentItem } =
    useModelInteractions({
      lastInteractionTimeRef,
      setIsUserInteraction,
      setManuallySelectedIndex,
      manuallySelectedIndex,
      currentIndex,
    });

  useSocketCommunication({
    activeIndex,
    models,
    socket,
    mobileId,
    isUserInteraction,
  });

  useEffect(() => {
    if (currentIndex >= 4) {
      setShowScrollHint(false);
      const interval = setInterval(() => {
        setShowScrollHint(true);
      }, 5 * 1000);

      return () => clearInterval(interval);
    }
  }, [currentIndex]);

  useEffect(() => {
    const scrollElement = outerRef?.current;
    if (!scrollElement) return;

    let lastScrollTime = Date.now();
    let lastScrollTop = scrollElement.scrollTop;

    const handleScroll = (e) => {
      const currentTime = Date.now();
      const currentScrollTop = scrollElement.scrollTop;
      const timeDelta = currentTime - lastScrollTime;

      const scrollSpeed =
        Math.abs(currentScrollTop - lastScrollTop) / timeDelta;
      const maxSpeed = CONSTANTS.MAX_SCROLL_SPEED;

      if (scrollSpeed > maxSpeed) {
        const maxScrollDelta = maxSpeed * timeDelta;
        const direction = currentScrollTop > lastScrollTop ? 1 : -1;
        scrollElement.scrollTop = lastScrollTop + maxScrollDelta * direction;
        e.preventDefault();
      }

      lastScrollTime = currentTime;
      lastScrollTop = scrollElement.scrollTop;
    };

    scrollElement.addEventListener("scroll", handleScroll, { passive: false });
    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, [outerRef]);

  useEffect(() => {
    lastIndexChangeTimeRef.current = Date.now();

    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
      setShowResetCountdown(false);
      setCountdownSeconds(30);
    }

    countdownTimerRef.current = setTimeout(() => {
      setShowResetCountdown(true);

      const startTime = Date.now();
      const countdownInterval = setInterval(() => {
        const remaining = 30 - Math.floor((Date.now() - startTime) / 1000);
        if (remaining <= 0) {
          clearInterval(countdownInterval);
        } else {
          setCountdownSeconds(remaining);
        }
      }, 1000);

      countdownTimerRef.current = countdownInterval;
    }, 120 * 1000);

    return () => {
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
      }
    };
  }, [currentIndex, manuallySelectedIndex]);

  return {
    models,
    activeIndex,
    dotPosition,
    listRef,
    itemRefs,
    handleItemClick,
    isCurrentItem,
    showScrollHint,
    showResetCountdown,
    countdownSeconds,
    showLoading,
    handleUserInteraction,
  };
}

export { CONSTANTS };
