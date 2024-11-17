import { useState, useEffect, useCallback, useRef } from "react";

export default function useMobileVisibility({
  socket,
  mobileId,
  isTrackingVisibility = true,
} = {}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const isInitialized = useRef(false);

  // Wait for functionality to be ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 30);

    return () => clearTimeout(timer);
  }, []);

  // Handle visibility state changes
  const handleVisibilityChange = useCallback(() => {
    const visibility = document.visibilityState === "visible";
    setIsVisible(visibility);
  }, []);

  const handleFocus = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleFocusOut = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleBlur = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handlePageHide = useCallback(() => {
    setIsVisible(false);
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
      handleFocusOut,
      handleBlur,
      handlePageHide,
      handlePageShow,
    });

    // Initial state check
    if (!document.hidden) {
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
    handleFocus,
    handleFocusOut,
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
  // Add visibility change first to ensure it's triggered before other events
  document.addEventListener(
    "visibilitychange",
    handlers.handleVisibilityChange,
    { capture: true }
  );
  window.addEventListener("focus", handlers.handleFocus, { capture: true });
  window.addEventListener("focusout", handlers.handleFocusOut, {
    capture: true,
  });

  window.addEventListener("blur", handlers.handleBlur);
  window.addEventListener("pageshow", handlers.handlePageShow, {
    capture: true,
  });
  window.addEventListener("pagehide", handlers.handlePageHide);

  return () => {
    document.removeEventListener(
      "visibilitychange",
      handlers.handleVisibilityChange,
      { capture: true }
    );
    window.removeEventListener("focus", handlers.handleFocus, {
      capture: true,
    });
    window.removeEventListener("focusout", handlers.handleFocusOut, {
      capture: true,
    });
    window.removeEventListener("blur", handlers.handleBlur);
    window.removeEventListener("pageshow", handlers.handlePageShow, {
      capture: true,
    });
    window.removeEventListener("pagehide", handlers.handlePageHide);
  };
}
