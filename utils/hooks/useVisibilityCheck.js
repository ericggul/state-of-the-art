import { useState, useEffect, useCallback } from "react";

export default function useVisibilityCheck({
  socket,
  mobileId,
  isTrackingVisibility = true,
} = {}) {
  const [isVisible, setIsVisible] = useState(true);

  const emitVisibilityChange = useCallback(() => {
    if (socket && socket.current) {
      try {
        socket.current.emit("on-off-visibility-change", {
          isVisible,
          mobileId,
        });
      } catch (e) {
        console.error("Error emitting visibility change:", e);
      }
    }
  }, [socket, isVisible, mobileId]);

  useEffect(() => {
    if (!isTrackingVisibility) return;

    const handleVisibilityChange = () => {
      const newVisibility = !document.hidden && document.hasFocus();
      setIsVisible(newVisibility);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", () => setIsVisible(true));
    window.addEventListener("blur", () => setIsVisible(false));

    // Initial check
    handleVisibilityChange();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", () => setIsVisible(true));
      window.removeEventListener("blur", () => setIsVisible(false));
    };
  }, [isTrackingVisibility]);

  useEffect(() => {
    emitVisibilityChange();
  }, [emitVisibilityChange]);

  return isVisible;
}
