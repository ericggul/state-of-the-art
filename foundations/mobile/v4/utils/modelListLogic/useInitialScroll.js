import { useEffect } from "react";
import { CONSTANTS } from "./constants";

export function useInitialScroll({
  listRef,
  isInitialScrollComplete,
  setIsInitialScrollComplete,
}) {
  useEffect(() => {
    console.log("InitialScroll Effect Started");
    const listElement = listRef.current;
    if (!listElement) {
      console.log("No list element");
      return;
    }

    let scrollTimeoutId;
    let completeTimeoutId;

    const initScroll = () => {
      console.log("InitScroll called");
      const itemHeight = listElement.children[0]?.offsetHeight || 0;
      console.log("Item height:", itemHeight);

      if (itemHeight === 0) {
        console.log("Zero height detected, returning");
        return;
      }

      const targetScroll = itemHeight * CONSTANTS.INITIAL_SCROLL_ITEMS;
      console.log("Attempting scroll to:", targetScroll);

      listElement.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });

      console.log("Scroll initiated");
    };

    console.log("Setting up initial timeout");
    scrollTimeoutId = setTimeout(initScroll, CONSTANTS.INITIAL_SCROLL_DELAY);

    return () => {
      console.log("Cleanup called");
      clearTimeout(scrollTimeoutId);
      clearTimeout(completeTimeoutId);
    };
  }, [listRef]);
}
