import { useState, useEffect } from "react";

export default function useMobileVisibility({
  socket,
  mobileId,

  requestVisibilityCheck,
  setRequestVisibilityCheck,
  isTrackingVisibility = true,
} = {}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isTrackingVisibility) return;

    const handleVisibilityChange = () => {
      // console.log("10 visibility change", document.hidden, document.hasFocus(), !document.hidden && document.hasFocus());
      // setIsVisible(!document.hidden && document.hasFocus());
    };

    const handleFocus = () => {
      console.log("14 focus");
      setIsVisible(true);
    };

    const handleBlur = () => {
      console.log("20 blur");
      setIsVisible(false);
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

  //socket operation
  useEffect(() => {
    if (!socket || !socket.current) return;

    if (requestVisibilityCheck) {
      setRequestVisibilityCheck(false);
      return;
    }

    try {
      console.log("firing 52");
      socket.current.emit("on-off-visibility-change", { isVisible, mobileId });
    } catch (e) {
      console.log(e);
    }
  }, [isVisible, requestVisibilityCheck]);

  return isVisible;
}
