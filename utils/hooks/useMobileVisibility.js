import { useState, useEffect, useCallback, useRef } from "react";
import { HEARTBEAT_INTERVAL } from "@/utils/constant";

export default function useVisibilityCheck({
  socket,
  mobileId,
  isTrackingVisibility = true,
} = {}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const isInitialized = useRef(false);
  const heartbeatInterval = useRef(null);

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
    handlePageHide,
    handlePageShow,
  ]);

  // Socket emissions for visibility changes
  useEffect(() => {
    if (!isReady || !socket?.current) return;

    try {
      socket.current.emit("mobile-new-visibility-change", {
        isVisible,
        mobileId,
        timestamp: Date.now(),
        origin: "useMobileVisibility",
      });
      console.log("✅ Visibility change:", isVisible);
    } catch (e) {
      console.error("❌ Socket emission error:", e);
    }
  }, [isReady, isVisible, socket, mobileId]);

  // Simple heartbeat mechanism
  useEffect(() => {
    if (!isReady || !socket?.current) return;

    // Only run heartbeat when visible
    if (isVisible) {
      const interval = setInterval(() => {
        socket.current.emit("mobile-new-heartbeat", {
          mobileId,
          timestamp: Date.now(),
        });
        console.log("💓 Heartbeat sent");
      }, HEARTBEAT_INTERVAL);

      // Handle timestamp requests
      socket.current.on("request-timestamp", () => {
        socket.current.emit("timestamp-response", {
          mobileId,
          timestamp: Date.now(),
        });
      });

      return () => {
        clearInterval(interval);
        socket.current.off("request-timestamp");
      };
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
