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

  // Socket emissions only happen after isReady
  useEffect(() => {
    if (!isReady || !socket?.current) return;

    try {
      socket.current.emit("mobile-new-visibility-change", {
        isVisible,
        mobileId,
        origin: "useMobileVisibility",
      });
      console.log("✅ Socket emission successful");
    } catch (e) {
      console.error("❌ Socket emission error:", e);
    }
  }, [isReady, isVisible, socket, mobileId]);

  // Implement heartbeat mechanism
  useEffect(() => {
    if (!isReady || !socket?.current) return;

    if (isVisible) {
      // Start sending heartbeats when the app is visible
      if (!heartbeatInterval.current) {
        heartbeatInterval.current = setInterval(() => {
          socket.current.emit("mobile-new-heartbeat", {
            mobileId,
            timestamp: Date.now(),
          });
          console.log("💓 Heartbeat sent");
        }, HEARTBEAT_INTERVAL); // Send heartbeat every 5 seconds (adjust as needed)
      }
    } else {
      // Stop sending heartbeats when the app is not visible
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
        heartbeatInterval.current = null;
      }
    }

    // Clean up when the component unmounts or visibility changes
    return () => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
        heartbeatInterval.current = null;
      }
    };
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
