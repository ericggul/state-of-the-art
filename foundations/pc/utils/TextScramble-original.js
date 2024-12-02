import { useEffect, useState, useCallback, useRef } from "react";

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!<>-_\\/[]{}—=+*^?#";

export default function TextScramble({ text, isAnimating }) {
  const [displayText, setDisplayText] = useState(text);
  const timerRef = useRef(null);
  const iterationsRef = useRef(0);
  const isAnimatingRef = useRef(false);

  const scramble = useCallback(() => {
    // Clear any existing animation
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Reset iterations
    iterationsRef.current = 0;
    isAnimatingRef.current = true;

    const maxIterations = 15;
    const interval = 30;

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

      iterationsRef.current += 1 / 3;

      if (iterationsRef.current >= maxIterations) {
        clearInterval(timerRef.current);
        setDisplayText(text);
        timerRef.current = null;
        isAnimatingRef.current = false;
      }
    }, interval);
  }, [text]);

  useEffect(() => {
    if (isAnimating) {
      // Immediately update text and start animation
      setDisplayText(text);
      scramble();
    } else {
      // Clean up any ongoing animation
      isAnimatingRef.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setDisplayText(text);
    }

    return () => {
      isAnimatingRef.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [text, isAnimating, scramble]);

  return displayText;
}
