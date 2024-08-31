import { useState, useEffect } from "react";

export default function useVisibilityCheck({ isTrackingVisibility = true } = {}) {
  const [isTabVisible, setIsTabVisible] = useState(!document.hidden && document.hasFocus());

  useEffect(() => {
    if (!isTrackingVisibility) return;

    const handleVisibilityChange = () => {
      console.log("10 visibility change", document.hidden, document.hasFocus(), !document.hidden && document.hasFocus());
      setIsTabVisible(!document.hidden && document.hasFocus());
    };

    const handleFocus = () => {
      console.log("14 focus");
      setIsTabVisible(true);
    };

    const handleBlur = () => {
      console.log("20 blur");
      setIsTabVisible(false);
    };

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [isTrackingVisibility]);

  return isTabVisible;
}
