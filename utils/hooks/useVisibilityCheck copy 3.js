import { useState, useEffect, useCallback } from "react";

export default function useVisibilityCheck({
  socket,
  mobileId,
  isTrackingVisibility = true,
} = {}) {
  const [isVisible, setIsVisible] = useState(true);
  console.log("🔄 Hook Reinitialized, Initial State:", { isVisible });

  // Memoize handlers to prevent recreation on each render
  const handleVisibilityChange = useCallback(() => {
    // Don't update visibility during page transitions
    if (document.readyState !== "complete") {
      console.log("🔄 Ignoring visibility change during page load");
      return;
    }

    const isPageVisible = !document.hidden;
    const hasFocus = document.hasFocus();
    // During page refresh, trust document.hidden more than focus
    const newVisibility = isPageVisible;

    console.log("👁️ Visibility Change Detected:", {
      trigger: "visibilitychange",
      isPageVisible,
      hasFocus,
      newVisibility,
      currentState: isVisible,
      documentHidden: document.hidden,
      readyState: document.readyState,
      time: new Date().toISOString(),
    });

    setIsVisible(newVisibility);
  }, [isVisible]);

  const handleFocus = useCallback(() => {
    console.log("🎯 Focus Event:", {
      trigger: "focus",
      currentState: isVisible,
      documentHidden: document.hidden,
      hasFocus: document.hasFocus(),
      time: new Date().toISOString(),
    });
    setIsVisible(true);
  }, [isVisible]);

  const handleBlur = useCallback(() => {
    console.log("💨 Blur Event:", {
      trigger: "blur",
      currentState: isVisible,
      documentHidden: document.hidden,
      hasFocus: document.hasFocus(),
      time: new Date().toISOString(),
    });

    if (document.hidden) {
      console.log(
        "📱 Setting visibility to false due to hidden document during blur"
      );
      setIsVisible(false);
    }
  }, [isVisible]);

  const handlePageHide = useCallback(() => {
    console.log("🔌 Page Hide Event:", {
      trigger: "pagehide/unload",
      currentState: isVisible,
      documentHidden: document.hidden,
      hasFocus: document.hasFocus(),
      socketExists: !!socket?.current,
      time: new Date().toISOString(),
    });

    if (socket?.current && document.hidden) {
      console.log("🔄 Attempting socket disconnect on page hide");
      try {
        socket.current.emit("mobile-new-visibility-change", {
          isVisible: false,
          mobileId,
        });
        socket.current.disconnect();
        console.log("✅ Socket disconnected successfully");
      } catch (e) {
        console.error("❌ Socket disconnect error:", e);
      }
    }

    if (document.hidden) {
      console.log("📱 Setting visibility to false on page hide");
      setIsVisible(false);
    }
  }, [socket, mobileId, isVisible]);

  const handlePageShow = useCallback(() => {
    console.log("🌟 Page Show Event:", {
      trigger: "pageshow",
      currentState: isVisible,
      documentHidden: document.hidden,
      hasFocus: document.hasFocus(),
      socketExists: !!socket?.current,
      socketDisconnected: socket?.current?.disconnected,
      time: new Date().toISOString(),
    });

    setIsVisible(true);

    if (socket?.current && socket.current.disconnected) {
      console.log("🔄 Attempting socket reconnect on page show");
      try {
        socket.current.connect();
        socket.current.emit("mobile-new-visibility-change", {
          isVisible: true,
          mobileId,
        });
        console.log("✅ Socket reconnected successfully");
      } catch (e) {
        console.error("❌ Socket reconnect error:", e);
      }
    }
  }, [socket, mobileId, isVisible]);

  // Setup visibility tracking
  useEffect(() => {
    if (!isTrackingVisibility) {
      console.log("⏸️ Visibility tracking disabled");
      return;
    }

    console.log("🚀 Setting up visibility tracking");

    // Wait for page to be fully loaded
    const initTimeout = setTimeout(() => {
      console.log("⚡ Initial visibility check:", {
        documentHidden: document.hidden,
        hasFocus: document.hasFocus(),
        readyState: document.readyState,
        time: new Date().toISOString(),
      });

      // Only trust document.hidden for initial state
      setIsVisible(!document.hidden);
    }, 300);

    // Event listeners setup
    console.log("📡 Attaching event listeners");

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("beforeunload", handlePageHide);
    window.addEventListener("unload", handlePageHide);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      console.log("🧹 Cleaning up event listeners");
      clearTimeout(initTimeout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("beforeunload", handlePageHide);
      window.removeEventListener("unload", handlePageHide);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [
    isTrackingVisibility,
    handleVisibilityChange,
    handleFocus,
    handleBlur,
    handlePageHide,
    handlePageShow,
  ]);

  // Handle socket emissions
  useEffect(() => {
    if (socket?.current) {
      console.log("📡 Socket emission for visibility change:", {
        isVisible,
        mobileId,
        time: new Date().toISOString(),
      });

      try {
        socket.current.emit("mobile-new-visibility-change", {
          isVisible,
          mobileId,
        });
        console.log("✅ Socket emission successful");
      } catch (e) {
        console.error("❌ Socket emission error:", e);
      }
    }
  }, [isVisible, socket, mobileId]);

  return isVisible;
}
