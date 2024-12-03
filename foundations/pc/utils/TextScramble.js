import { useEffect, useState, useCallback, useRef } from "react";
import useStore from "@/components/screen/store";

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!<>-_\\/[]{}—=+*^?#";

const DEFAULT_INTERVAL = 30;

export default function TextScramble({ text, speed = 1 }) {
  const [displayText, setDisplayText] = useState(text);
  const timerRef = useRef(null);
  const iterationsRef = useRef(0);
  const isAnimatingRef = useRef(false);

  const scramble = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    iterationsRef.current = 0;
    isAnimatingRef.current = true;

    const maxIterations = text.length;
    const interval = DEFAULT_INTERVAL / speed;

    timerRef.current = setInterval(() => {
      if (!isAnimatingRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        return;
      }

      setDisplayText((currentText) =>
        text
          .split("")
          .map((char, idx) => {
            if (idx < iterationsRef.current) {
              return text[idx];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("")
      );

      iterationsRef.current += Math.max(1, Math.floor(speed));

      if (iterationsRef.current >= maxIterations) {
        clearInterval(timerRef.current);
        setDisplayText(text);
        timerRef.current = null;
        isAnimatingRef.current = false;
      }
    }, interval);
  }, [text, speed]);

  useEffect(() => {
    scramble();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [text, scramble]);

  return displayText;
}
