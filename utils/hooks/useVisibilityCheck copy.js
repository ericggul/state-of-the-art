import { useState, useEffect } from "react";

export default function useVisibilityCheck({
  socket,
  mobileId,
  isTrackingVisibility = true,
} = {}) {
  const [isVisible, setIsVisible] = useState(true);

  console.log("useVisibilityCheck", isVisible);

  useEffect(() => {
    if (!isTrackingVisibility) return;

    const handleVisibilityChange = () => {
      const newVisibility = !document.hidden && document.hasFocus();
      console.log("Visibility changed:", newVisibility);
      setIsVisible(newVisibility);
    };

    const handlePageHide = () => {
      console.log("Page is being hidden or unloaded");
      setIsVisible(false);

      // Attempt to notify the server synchronously
      if (socket && socket.current) {
        try {
          socket.current.emit("mobile-new-visibility-change", {
            isVisible: false,
            mobileId,
          });

          // Close the socket immediately
          socket.current.disconnect();
        } catch (e) {
          console.error("Error emitting visibility change during unload:", e);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", () => setIsVisible(true));
    window.addEventListener("blur", () => setIsVisible(false));

    // Handle page unload events
    window.addEventListener("beforeunload", handlePageHide);
    window.addEventListener("unload", handlePageHide);
    window.addEventListener("pagehide", handlePageHide);

    // Initial check
    handleVisibilityChange();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", () => setIsVisible(true));
      window.removeEventListener("blur", () => setIsVisible(false));

      window.removeEventListener("beforeunload", handlePageHide);
      window.removeEventListener("unload", handlePageHide);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [isTrackingVisibility, socket, mobileId]);

  useEffect(() => {
    if (socket && socket.current) {
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
