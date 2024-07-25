import { useRef, useEffect } from "react";

const getRandom = (a, b) => Math.random() * (b - a) + a;

export default function useIncrementalInterval(callback, minDelay, maxDelay) {
  const timeoutId = useRef();
  const savedCallback = useRef();
  const intervalCountRef = useRef(1);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const isEnabled = typeof minDelay === "number" && typeof maxDelay === "number";

    if (isEnabled) {
      const handleTick = () => {
        intervalCountRef.current *= 1.2;
        const nextTickAt = getRandom(minDelay, maxDelay) * intervalCountRef.current;

        timeoutId.current = setTimeout(() => {
          savedCallback.current();
          handleTick();
        }, nextTickAt);
      };

      handleTick();
    }

    return () => timeoutId.current && clearTimeout(timeoutId.current);
  }, [minDelay, maxDelay]);

  return timeoutId.current;
}
