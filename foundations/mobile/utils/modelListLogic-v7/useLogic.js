import { useState, useRef, useMemo, useEffect } from "react";
import { useModelObservers } from "./useModelObservers";
import { useModelInteractions } from "./useModelInteractions";
import { useInitialScroll } from "./useInitialScroll";
import { useSocketCommunication } from "./useSocketCommunication";
import { CONSTANTS } from "./constants";
import * as ALL_CONSTANTS from "@/utils/constant";

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

export function useModelListLogic({
  initialModels,
  socket,
  mobileId,
  isVisible,
}) {
  // States
  const [models, setModels] = useState(initialModels);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [manuallySelectedIndex, setManuallySelectedIndex] = useState(null);
  const [dotPosition, setDotPosition] = useState({ top: 0, height: 0 });
  const [isUserInteraction, setIsUserInteraction] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [showResetCountdown, setShowResetCountdown] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(30);

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

    if (isAndroid) {
      // Android: Use v2 speed-limiting scroll logic
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
              listElement.scrollTop =
                lastScrollTop + maxScrollDelta * direction;
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
    } else {
      // iOS: Enhanced momentum scrolling logic
      let isScrolling = false;
      let lastTime = null;

      function updateScroll(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        if (
          Math.abs(smoothedVelocityRef.current) > MOMENTUM_CONFIG.minVelocity
        ) {
          // Apply smoothing to the velocity
          smoothedVelocityRef.current =
            smoothedVelocityRef.current * MOMENTUM_CONFIG.friction;

          // Apply the smoothed velocity to scroll position
          listElement.scrollTop += smoothedVelocityRef.current;

          // Check bounds
          if (
            listElement.scrollTop <= 0 ||
            listElement.scrollTop >=
              listElement.scrollHeight - listElement.clientHeight
          ) {
            smoothedVelocityRef.current = 0;
            velocityRef.current = 0;
          }

          animationFrameRef.current = requestAnimationFrame(updateScroll);
        } else {
          isScrolling = false;
          lastTime = null;
        }
      }

      function handleTouchStart(e) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        velocityRef.current = 0;
        smoothedVelocityRef.current = 0;
        lastTouchYRef.current = e.touches[0].clientY;
        lastTime = null;
      }

      function handleTouchMove(e) {
        const deltaY = lastTouchYRef.current - e.touches[0].clientY;
        lastTouchYRef.current = e.touches[0].clientY;

        // Calculate new velocity with smoothing
        const rawVelocity = deltaY * MOMENTUM_CONFIG.multiplier;
        const clampedVelocity = Math.max(
          -MOMENTUM_CONFIG.maxVelocity,
          Math.min(MOMENTUM_CONFIG.maxVelocity, rawVelocity)
        );

        // Smooth the velocity transition
        velocityRef.current = clampedVelocity;
        smoothedVelocityRef.current =
          smoothedVelocityRef.current * (1 - MOMENTUM_CONFIG.smoothingFactor) +
          velocityRef.current * MOMENTUM_CONFIG.smoothingFactor;

        listElement.scrollTop += deltaY;
      }

      function handleTouchEnd() {
        if (
          Math.abs(smoothedVelocityRef.current) > MOMENTUM_CONFIG.minVelocity
        ) {
          isScrolling = true;
          lastTime = null;
          animationFrameRef.current = requestAnimationFrame(updateScroll);
        }
      }

      listElement.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      listElement.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });
      listElement.addEventListener("touchend", handleTouchEnd, {
        passive: true,
      });

      return () => {
        listElement.removeEventListener("touchstart", handleTouchStart);
        listElement.removeEventListener("touchmove", handleTouchMove);
        listElement.removeEventListener("touchend", handleTouchEnd);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, []);

  // Track index changes for inactivity
  const isVisibleRef = useRef(isVisible);
  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  console.log("isVisible", isVisible);

  console.log("isVisibleRef.current", isVisibleRef.current);

  useEffect(() => {
    // Don't start countdown if not visible
    if (!isVisibleRef.current) return;

    lastIndexChangeTimeRef.current = Date.now();

    console.log("isVisibleRef.current", isVisibleRef.current);

    // Clear any existing countdown
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
      setShowResetCountdown(false);
      setCountdownSeconds(30);
    }

    // Set new inactivity timer
    countdownTimerRef.current = setTimeout(() => {
      // Double check visibility before showing countdown
      console.log("isVisibleRef.current", isVisibleRef.current);
      if (!isVisibleRef.current) return;

      setShowResetCountdown(true);

      // Simple countdown
      const startTime = Date.now();
      const countdownInterval = setInterval(() => {
        // Stop countdown if no longer visible
        if (!isVisibleRef.current) {
          clearInterval(countdownInterval);
          setShowResetCountdown(false);
          setCountdownSeconds(30);
          return;
        }

        const remaining = 30 - Math.floor((Date.now() - startTime) / 1000);
        if (remaining < 0) {
          clearInterval(countdownInterval);
        } else {
          setCountdownSeconds(remaining);
        }
      }, 1000);

      countdownTimerRef.current = countdownInterval;
    }, Math.max(ALL_CONSTANTS.INACTIVITY_TIMEOUT + ALL_CONSTANTS.FRONTEND_INACTIVITY_TIMEOUT - 30 * 1000, 100));

    return () => {
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
      }
    };
  }, [currentIndex, manuallySelectedIndex, isVisible]);

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
