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
  friction: isIOS ? 0.9 : 0.94, // Increased friction for iOS (was 0.95)
  multiplier: isIOS ? 0.5 : 0.3, // Reduced multiplier for iOS (was 0.8)
  minVelocity: isIOS ? 0.08 : 0.03, // Adjusted minimum velocity for iOS (was 0.1)
};

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

  // Add these refs for momentum scrolling
  const velocityRef = useRef(0);
  const lastTouchYRef = useRef(0);
  const lastScrollTopRef = useRef(0);
  const animationFrameRef = useRef(null);

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
      // iOS: Keep current momentum scrolling logic
      let isScrolling = false;

      function updateScroll() {
        if (Math.abs(velocityRef.current) > MOMENTUM_CONFIG.minVelocity) {
          velocityRef.current *= MOMENTUM_CONFIG.friction;
          listElement.scrollTop += velocityRef.current;

          if (
            listElement.scrollTop <= 0 ||
            listElement.scrollTop >=
              listElement.scrollHeight - listElement.clientHeight
          ) {
            velocityRef.current = 0;
          }

          animationFrameRef.current = requestAnimationFrame(updateScroll);
        } else {
          isScrolling = false;
        }
      }

      function handleTouchStart(e) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        velocityRef.current = 0;
        lastTouchYRef.current = e.touches[0].clientY;
      }

      function handleTouchMove(e) {
        const deltaY = lastTouchYRef.current - e.touches[0].clientY;
        lastTouchYRef.current = e.touches[0].clientY;
        velocityRef.current = deltaY * MOMENTUM_CONFIG.multiplier;
        listElement.scrollTop += deltaY;
      }

      function handleTouchEnd() {
        if (Math.abs(velocityRef.current) > MOMENTUM_CONFIG.minVelocity) {
          isScrolling = true;
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
