import { useRef, useEffect, useState } from "react";

const getRandom = (a, b) => Math.random() * (b - a) + a;

export default function useOpacityInterval() {
  const [opacity, setOpacity] = useState(0.1);

  const timeoutId = useRef();
  const intervalCountRef = useRef(1);

  // Set up the interval.
  useEffect(() => {
    const minDelay = 10;
    const maxDelay = 200;

    const handleTick = () => {
      intervalCountRef.current *= 1.2;
      const nextTickAt = getRandom(minDelay, maxDelay) * intervalCountRef.current;

      timeoutId.current = setTimeout(() => {
        setOpacity((o) => 1 - o);
        handleTick();
      }, nextTickAt);
    };

    handleTick();

    return () => timeoutId.current && clearTimeout(timeoutId.current);
  }, []);

  return opacity;
}
