import { useState, useRef, useMemo, useEffect } from "react";
import { useModelObservers } from "./useModelObservers";
import { useModelInteractions } from "./useModelInteractions";
import { useInitialScroll } from "./useInitialScroll";
import { useSocketCommunication } from "./useSocketCommunication";
import { CONSTANTS } from "./constants";

const SCROLL_THROTTLE_MS = 16; // Approximately 60fps

// Detect platform
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isAndroid = /Android/.test(navigator.userAgent);

const MOMENTUM_CONFIG = {
  friction: isIOS ? 0.92 : 0.94, // Slightly reduced friction for smoother decay
  multiplier: isIOS ? 0.35 : 0.3, // Adjusted multiplier for more natural feel
  minVelocity: isIOS ? 0.05 : 0.03, // Lower threshold for smoother stop
  smoothingFactor: 0.2, // New parameter for velocity smoothing
  maxVelocity: 50, // New parameter to prevent excessive speed
};

export function useModelListLogic({ initialModels, socket, mobileId }) {
  // States
  const [models, setModels] = useState(initialModels);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [manuallySelectedIndex, setManuallySelectedIndex] = useState(null);
  const [dotPosition, setDotPosition] = useState({ top: 0, height: 0 });
  const [isUserInteraction, setIsUserInteraction] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [showResetCountdown, setShowResetCountdown] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(30);

  const [showLoading, setShowLoading] = useState(false);

  // Single timer ref for countdown
  const countdownTimerRef = useRef(null);
  const lastIndexChangeTimeRef = useRef(Date.now());

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
      setShowLoading,
    });

  console.log("showLoading", showLoading);

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
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setShowScrollHint(false);
  //   }, CONSTANTS.SCROLL_HINT_DURATION);

  //   return () => clearTimeout(timeout);
  // }, []);

  useEffect(() => {
    if (currentIndex >= 4) {
      setShowScrollHint(false);
      const interval = setInterval(() => {
        setShowScrollHint(true);
      }, 5 * 1000); // Check every second

      return () => clearInterval(interval);
    }
  }, [currentIndex]);

  // Add these refs for momentum scrolling
  const velocityRef = useRef(0);
  const lastTouchYRef = useRef(0);
  const lastScrollTopRef = useRef(0);
  const animationFrameRef = useRef(null);

  // Add new ref for smoothed velocity
  const smoothedVelocityRef = useRef(0);

  // Scroll handling effect
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
      const maxSpeed = CONSTANTS.MAX_SCROLL_SPEED;

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

  // Track index changes for inactivity
  useEffect(() => {
    lastIndexChangeTimeRef.current = Date.now();

    // Clear any existing countdown
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
      setShowResetCountdown(false);
      setCountdownSeconds(30);
    }

    // Set new inactivity timer
    countdownTimerRef.current = setTimeout(() => {
      setShowResetCountdown(true);

      // Simple countdown
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
    }, 60000); // 60 seconds of no index changes

    return () => {
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
      }
    };
  }, [currentIndex, manuallySelectedIndex]); // Only track actual index changes

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
  };
}

export { CONSTANTS };
