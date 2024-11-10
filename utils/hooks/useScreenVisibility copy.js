import { Suspense, useEffect, useState, useRef } from "react";
import useScreenStore from "@/components/screen/store";

export default function useScreenVisibility() {
  const { mobileVisibility, isProjector, setStage, stage, setIsTransition } =
    useScreenStore();

  const timeoutRef1 = useRef(null);
  const timeoutRef2 = useRef(null);
  const timeoutRef3 = useRef(null);

  useEffect(() => {
    if (stage === "Idle") return;
    if (mobileVisibility) {
      setStage("Frontend");
      setIsTransition(false);
    } else {
      setIsTransition(true);
      timeoutRef1.current = setTimeout(() => {
        setIsTransition(false);
      }, 5000);
      timeoutRef2.current = setTimeout(() => {
        setStage("Backend");
      }, 6000);
      timeoutRef3.current = setTimeout(
        () => {
          setStage(null);
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
      if (timeoutRef3.current) {
        clearTimeout(timeoutRef3.current);
      }
    };
  }, [stage, mobileVisibility, isProjector]);
}
