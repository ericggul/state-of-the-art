import { useState, useEffect, useCallback } from "react";

export default function useVisibilityCheck({
  socket,
  mobileId,
  isTrackingVisibility = true,
} = {}) {
  const [isVisible, setIsVisible] = useState(true);

  // Memoize handlers to prevent recreation on each render
  const handleVisibilityChange = useCallback(() => {
    // Check if the page is actually visible
    const isPageVisible = !document.hidden;
    const hasFocus = document.hasFocus();

    // Only set to false if both conditions are false
    // This prevents false negatives during page refresh
    const newVisibility = isPageVisible || hasFocus;

    console.log("Visibility check:", {
      isPageVisible,
      hasFocus,
      newVisibility,
    });

    setIsVisible(newVisibility);
  }, []);

  const handleFocus = useCallback(() => {
    console.log("Window focused");
    setIsVisible(true);
  }, []);

  const handleBlur = useCallback(() => {
    console.log("Window blurred");
    // Don't set to false immediately on blur
    // Let visibility change handler handle it
  }, []);

  const handlePageHide = useCallback(() => {
    console.log("Page hide/unload triggered");

    // Only emit if we're actually hiding the page
    // (not just refreshing)
    if (socket?.current && !document.hasFocus()) {
      try {
        socket.current.emit("mobile-new-visibility-change", {
          isVisible: false,
          mobileId,
        });
        socket.current.disconnect();
      } catch (e) {
        console.error("Error during page hide:", e);
      }
    }
  }, [socket, mobileId]);

  // Setup visibility tracking
  useEffect(() => {
    if (!isTrackingVisibility) return;

    // Initial check with slight delay to ensure accurate state
    const initTimeout = setTimeout(handleVisibilityChange, 100);

    // Event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("beforeunload", handlePageHide);
    window.addEventListener("unload", handlePageHide);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      clearTimeout(initTimeout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("beforeunload", handlePageHide);
      window.removeEventListener("unload", handlePageHide);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [
    isTrackingVisibility,
    handleVisibilityChange,
    handleFocus,
    handleBlur,
    handlePageHide,
  ]);

  // Handle socket emissions
  useEffect(() => {
    if (socket?.current) {
      try {
        console.log("Emitting visibility change:", isVisible);
        socket.current.emit("mobile-new-visibility-change", {
          isVisible,
          mobileId,
        });
      } catch (e) {
        console.error("Error emitting visibility change:", e);
      }
    }
  }, [isVisible, socket, mobileId]);

  return isVisible;
}
