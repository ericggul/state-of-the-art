import { Suspense, useEffect, useState, useRef } from "react";
import useScreenStore from "@/components/screen/store";

export default function useScreenVisibility() {
  const { mobileVisibility, isProjector } = useScreenStore();

  const [showFrontend, setShowFrontend] = useState(true);
  const [showBackend, setShowBackend] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const timeoutRef1 = useRef(null);
  const timeoutRef2 = useRef(null);

  useEffect(() => {
    if (mobileVisibility) {
      setShowFrontend(true);
      setShowBackend(false);
      setShowTransition(false);
    } else {
      setShowTransition(true);
      timeoutRef1.current = setTimeout(() => {
        setShowBackend(true);
        setShowTransition(false);
      }, 3000);
      timeoutRef2.current = setTimeout(
        () => {
          setShowFrontend(false);
        },
        isProjector ? 3000 : 300
      );
    }

    return () => {
      if (timeoutRef1.current) {
        clearTimeout(timeoutRef1.current);
      }
      if (timeoutRef2.current) {
        clearTimeout(timeoutRef2.current);
      }
    };
  }, [mobileVisibility, isProjector]);

  return { showFrontend, showBackend, showTransition };
}
