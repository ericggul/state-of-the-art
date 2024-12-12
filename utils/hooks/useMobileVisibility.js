import { useState, useEffect, useCallback, useRef } from "react";
import useDebounce from "./useDebounce";

export default function useVisibilityCheck({
  socket,
  mobileId,
  isTrackingVisibility = true,
} = {}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const isInitialized = useRef(false);
  const debouncedIsVisible = useDebounce(isVisible, 300); // 300ms debounce

  // Wait for functionality to be ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 30);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Handle visibility state changes with additional checks
  const handleVisibilityChange = useCallback(() => {
    const visibility = document.visibilityState === "visible";
    const hasFocus = document.hasFocus();
    setIsVisible(visibility);
  }, []);

  const handlePageHide = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handlePageShow = useCallback(() => {
    setIsVisible(true);
  }, []);

  // Set up visibility tracking only after the page is ready
  useEffect(() => {
    if (!isReady || !isTrackingVisibility || isInitialized.current) {
      return;
    }

    isInitialized.current = true;

    const cleanupListeners = setupEventListeners({
      handleVisibilityChange,
      handlePageHide,
      handlePageShow,
    });

    // Initial state check
    if (document.visibilityState === "visible") {
      setIsVisible(true);
    }

    return () => {
      cleanupListeners();
      isInitialized.current = false;
    };
  }, [
    isReady,
    isTrackingVisibility,
    handleVisibilityChange,
    handlePageHide,
    handlePageShow,
  ]);

  // Socket emissions for visibility changes using debounced value
  useEffect(() => {
    if (!socket?.current) {
      return;
    }

    try {
      socket.current.emit("mobile-new-visibility-change", {
        isVisible: debouncedIsVisible,
        mobileId,
        origin: "useMobileVisibility",
      });
    } catch (e) {
      console.error("Socket emission error:", e);
    }
  }, [debouncedIsVisible, socket, mobileId]);

  return debouncedIsVisible;
}

// Event Listener Setup
function setupEventListeners(handlers) {
  document.addEventListener(
    "visibilitychange",
    handlers.handleVisibilityChange
  );
  window.addEventListener("pageshow", handlers.handlePageShow);
  window.addEventListener("pagehide", handlers.handlePageHide);

  return () => {
    document.removeEventListener(
      "visibilitychange",
      handlers.handleVisibilityChange
    );
    window.removeEventListener("pageshow", handlers.handlePageShow);
    window.removeEventListener("pagehide", handlers.handlePageHide);
  };
}
