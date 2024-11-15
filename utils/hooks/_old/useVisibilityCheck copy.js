import { useState, useEffect, useCallback, useRef } from "react";

export default function useVisibilityCheck({
  socket,
  mobileId,
  isTrackingVisibility = true,
} = {}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const isInitialized = useRef(false);

  // Wait for 1 second before starting any functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 30);

    return () => clearTimeout(timer);
  }, []);

  // Handle visibility state changes
  const handleVisibilityChange = useCallback(() => {
    setIsVisible(!document.hidden);
  }, []);

  const handleFocus = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleBlur = useCallback(() => {
    if (document.hidden) setIsVisible(false);
  }, []);

  const handlePageHide = useCallback(() => {
    if (document.hidden) setIsVisible(false);
  }, []);

  const handlePageShow = useCallback(() => {
    setIsVisible(true);
  }, []);

  // Set up visibility tracking only after the page is ready
  useEffect(() => {
    if (!isReady || !isTrackingVisibility || isInitialized.current) return;

    isInitialized.current = true;

    const cleanupListeners = setupEventListeners({
      handleVisibilityChange,
      handleFocus,
      handleBlur,
      handlePageHide,
      handlePageShow,
    });

    return () => {
      cleanupListeners();
      isInitialized.current = false;
    };
  }, [
    isReady,
    isTrackingVisibility,
    handleVisibilityChange,
    handleFocus,
    handleBlur,
    handlePageHide,
    handlePageShow,
  ]);

  // Socket emissions only happen after isReady
  useEffect(() => {
    if (!isReady || !socket?.current) return;

    try {
      socket.current.emit("mobile-new-visibility-change", {
        isVisible,
        mobileId,
      });
      console.log("✅ Socket emission successful");
    } catch (e) {
      console.error("❌ Socket emission error:", e);
    }
  }, [isReady, isVisible, socket, mobileId]);

  return isVisible;
}
// Event Listener Setup
function setupEventListeners(handlers) {
  document.addEventListener(
    "visibilitychange",
    handlers.handleVisibilityChange
  );
  window.addEventListener("focus", handlers.handleFocus);
  window.addEventListener("blur", handlers.handleBlur);
  window.addEventListener("beforeunload", handlers.handlePageHide);
  window.addEventListener("unload", handlers.handlePageHide);
  window.addEventListener("pagehide", handlers.handlePageHide);
  window.addEventListener("pageshow", handlers.handlePageShow);

  return () => {
    document.removeEventListener(
      "visibilitychange",
      handlers.handleVisibilityChange
    );
    window.removeEventListener("focus", handlers.handleFocus);
    window.removeEventListener("blur", handlers.handleBlur);
    window.removeEventListener("beforeunload", handlers.handlePageHide);
    window.removeEventListener("unload", handlers.handlePageHide);
    window.removeEventListener("pagehide", handlers.handlePageHide);
    window.removeEventListener("pageshow", handlers.handlePageShow);
  };
}
