import { useRef, useEffect, useState } from "react";

const getRandom = (a, b) => Math.random() * (b - a) + a;

export default function useOpacityInterval() {
  const [opacity, setOpacity] = useState(0.1);

  const timeoutId = useRef();
  const intervalCountRef = useRef(1);

  const opacityBoundRef = useRef(0);

  // Set up the interval.
  useEffect(() => {
    const minDelay = 10;
    const maxDelay = 50;

    const handleTick = () => {
      intervalCountRef.current *= 1.1;
      opacityBoundRef.current += 0.023;
      const nextTickAt = getRandom(minDelay, maxDelay) * intervalCountRef.current;

      timeoutId.current = setTimeout(() => {
        const opacityBound = opacityBoundRef.current;
        setOpacity((o) => Math.max(Math.random(), opacityBound));
        handleTick();
      }, nextTickAt);
    };

    handleTick();

    return () => timeoutId.current && clearTimeout(timeoutId.current);
  }, []);

  return opacity;
}
