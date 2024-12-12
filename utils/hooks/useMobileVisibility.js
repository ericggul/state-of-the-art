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
    console.log("Setting up readiness timer");
    const timer = setTimeout(() => {
      setIsReady(true);
      console.log("Component is ready");
    }, 30);

    return () => {
      clearTimeout(timer);
      console.log("Readiness timer cleared");
    };
  }, []);

  // Handle visibility state changes with additional checks
  const handleVisibilityChange = useCallback(() => {
    const visibility = document.visibilityState === "visible";
    const hasFocus = document.hasFocus();
    console.log("Visibility change detected", { visibility, hasFocus });
    setIsVisible(visibility);
  }, []);

  const handlePageHide = useCallback(() => {
    setIsVisible(false);
    console.log("Page hidden, set isVisible to false");
  }, []);

  const handlePageShow = useCallback(() => {
    setIsVisible(true);
    console.log("Page shown, set isVisible to true");
  }, []);

  // Set up visibility tracking only after the page is ready
  useEffect(() => {
    if (!isReady || !isTrackingVisibility || isInitialized.current) {
      console.log("Skipping visibility tracking setup");
      return;
    }

    isInitialized.current = true;
    console.log("Setting up visibility tracking");

    const cleanupListeners = setupEventListeners({
      handleVisibilityChange,
      handlePageHide,
      handlePageShow,
    });

    // Initial state check
    if (document.visibilityState === "visible") {
      setIsVisible(true);
      console.log("Initial state: set isVisible to true");
    }

    return () => {
      cleanupListeners();
      isInitialized.current = false;
      console.log("Cleaned up visibility tracking");
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
      console.log("Socket not available, skipping emission");
      return;
    }

    try {
      console.log(`Emitting visibility change: ${debouncedIsVisible}`, {
        mobileId,
      });
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
  console.log("Adding event listeners for visibility tracking");
  document.addEventListener(
    "visibilitychange",
    handlers.handleVisibilityChange
  );
  window.addEventListener("pageshow", handlers.handlePageShow);
  window.addEventListener("pagehide", handlers.handlePageHide);

  return () => {
    console.log("Removing event listeners for visibility tracking");
    document.removeEventListener(
      "visibilitychange",
      handlers.handleVisibilityChange
    );
    window.removeEventListener("pageshow", handlers.handlePageShow);
    window.removeEventListener("pagehide", handlers.handlePageHide);
  };

  return { isVisible };
}
