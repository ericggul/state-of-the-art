import { useEffect, useState, useCallback, useRef } from "react";
import useStore from "@/components/screen/store";

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!<>-_\\/[]{}—=+*^?#";

export default function TextScramble({ text }) {
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

      iterationsRef.current += 1;

      if (iterationsRef.current >= maxIterations) {
        clearInterval(timerRef.current);
        setDisplayText(text);
        timerRef.current = null;
        isAnimatingRef.current = false;
      }
    }, interval);
  }, [text]);

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
