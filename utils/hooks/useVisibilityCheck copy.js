import { useState, useEffect, useCallback, useRef } from "react";

// Constants
const INIT_TIMEOUT = 300;
const EVENT_TYPES = {
  VISIBILITY: "visibilitychange",
  FOCUS: "focus",
  BLUR: "blur",
  BEFORE_UNLOAD: "beforeunload",
  UNLOAD: "unload",
  PAGE_HIDE: "pagehide",
  PAGE_SHOW: "pageshow",
};

// Event Listener Setup - Added back the missing function
const setupEventListeners = (handlers) => {
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
};

export default function useVisibilityCheck({
  socket,
  mobileId,
  isTrackingVisibility = true,
} = {}) {
  const [isVisible, setIsVisible] = useState(true);
  const isInitialized = useRef(false);
  const previousVisibility = useRef(true);

  const emitVisibilityChange = useCallback(
    (newVisibility) => {
      if (!socket?.current || previousVisibility.current === newVisibility)
        return;

      alert("📡 Emitting visibility change:", {
        isVisible: newVisibility,
        mobileId,
        time: new Date().toISOString(),
      });

      try {
        socket.current.emit("mobile-new-visibility-change", {
          isVisible: newVisibility,
          mobileId,
        });
        previousVisibility.current = newVisibility;
        console.log("✅ Socket emission successful");
      } catch (e) {
        console.error("❌ Socket emission error:", e);
      }
    },
    [socket, mobileId]
  );

  const updateVisibility = useCallback(
    (newVisibility) => {
      setIsVisible(newVisibility);
      emitVisibilityChange(newVisibility);
    },
    [emitVisibilityChange]
  );

  const handleVisibilityChange = useCallback(() => {
    if (document.readyState !== "complete") return;
    updateVisibility(!document.hidden);
  }, [updateVisibility]);

  const handleFocus = useCallback(() => {
    updateVisibility(true);
  }, [updateVisibility]);

  const handleBlur = useCallback(() => {
    if (document.hidden) updateVisibility(false);
  }, [updateVisibility]);

  const handlePageHide = useCallback(() => {
    if (document.hidden) {
      updateVisibility(false);
    }
  }, [updateVisibility]);

  const handlePageShow = useCallback(() => {
    updateVisibility(true);
  }, [updateVisibility]);

  useEffect(() => {
    if (!isTrackingVisibility || isInitialized.current) return;

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
    isTrackingVisibility,
    handleVisibilityChange,
    handleFocus,
    handleBlur,
    handlePageHide,
    handlePageShow,
  ]);

  return isVisible;
}
