import { useRef, useEffect, useState } from "react";

const getRandom = (a, b) => Math.random() * (b - a) + a;

export default function useOpacityInterval() {
  const [opacity, setOpacity] = useState(0.1);

  const timeoutId = useRef();
  const intervalCountRef = useRef(1);

  const opacityBoundRef = useRef(0);

  const minDelay = 10;
  const maxDelay = 40;

  // Set up the interval.
  useEffect(() => {
    const handleTick = () => {
      intervalCountRef.current *= 1.05;
      opacityBoundRef.current += 0.008;
      const nextTickAt = getRandom(minDelay, maxDelay) * intervalCountRef.current;

      timeoutId.current = setTimeout(() => {
        const opacityBound = opacityBoundRef.current;
        setOpacity((o) => Math.max(1 - o, opacityBound));
        handleTick();
      }, nextTickAt);
    };

    handleTick();

    return () => timeoutId.current && clearTimeout(timeoutId.current);
  }, [minDelay, maxDelay]);

  return opacity;
}
