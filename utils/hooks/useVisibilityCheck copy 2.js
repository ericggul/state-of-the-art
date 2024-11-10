import { useState, useEffect, useCallback, useRef } from "react";

const EVENT_TYPES = {
  VISIBILITY: "visibilitychange",
  FOCUS: "focus",
  BLUR: "blur",
  BEFORE_UNLOAD: "beforeunload",
  UNLOAD: "unload",
  PAGE_HIDE: "pagehide",
  PAGE_SHOW: "pageshow",
};

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

  // Handle visibility state changes
  const handleVisibilityChange = useCallback(() => {
    alert("🔄 handleVisibilityChange");
    if (document.readyState !== "complete") return;
    setIsVisible(!document.hidden);
  }, []);

  const handleFocus = useCallback(() => {
    alert("🔄 handleFocus");
    setIsVisible(true);
  }, []);

  const handleBlur = useCallback(() => {
    alert("🔄 handleBlur");
    if (document.hidden) setIsVisible(false);
  }, []);

  const handlePageHide = useCallback(() => {
    alert("🔄 handlePageHide");
    if (document.hidden) setIsVisible(false);
  }, []);

  const handlePageShow = useCallback(() => {
    alert("🔄 handlePageShow");
    setIsVisible(true);
  }, []);

  // Set up visibility tracking
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

  // Handle socket emissions based on visibility changes
  useEffect(() => {
    if (!socket?.current) return;

    try {
      socket.current.emit("mobile-new-visibility-change", {
        isVisible,
        mobileId,
      });
      console.log("✅ Socket emission successful");
    } catch (e) {
      console.error("❌ Socket emission error:", e);
    }
  }, [isVisible, socket, mobileId]);

  return isVisible;
}
