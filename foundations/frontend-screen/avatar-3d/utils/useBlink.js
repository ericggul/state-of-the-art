import { useEffect, useState } from "react";

const getRandom = (min, max) => Math.random() * (max - min) + min;

export default function useBlink() {
  // Imported from r3f-virtual-girlfriend project
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    let blinkTimeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, getRandom(100, 300));
      }, getRandom(1000, 3000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  return { blink };
}
