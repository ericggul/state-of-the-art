import { useRef, useEffect } from "react";

const getRandom = (a, b) => Math.random() * (b - a) + a;

export default function useRandomInterval(callback, minDelay, maxDelay, activated = true) {
  const timeoutId = useRef();
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const isEnabled = typeof minDelay === "number" && typeof maxDelay === "number";

    if (isEnabled && activated) {
      const handleTick = () => {
        const nextTickAt = getRandom(minDelay, maxDelay);

        timeoutId.current = setTimeout(() => {
          savedCallback.current();
          handleTick();
        }, nextTickAt);
      };

      handleTick();
    }

    return () => timeoutId.current && clearTimeout(timeoutId.current);
  }, [minDelay, maxDelay, activated]);

  return timeoutId.current;
}
