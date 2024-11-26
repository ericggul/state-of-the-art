import { useState, useEffect, useCallback, useRef } from "react";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

const MIN_CHAR_INTERVAL = 40;
const MAX_CHAR_INTERVAL = 90;

export const useTypewriter = (text, isTyping) => {
  const [displayText, setDisplayText] = useState("");
  const [delayComplete, setDelayComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const indexRef = useRef(0);

  const typeNextChar = useCallback(() => {
    if (indexRef.current <= text.length) {
      setDisplayText(text.slice(0, indexRef.current));
      indexRef.current++;
      return true;
    }
    return false;
  }, [text]);

  useEffect(() => {
    if (!isTyping) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setDisplayText("");
        indexRef.current = 0;
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [isTyping]);

  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        setDelayComplete(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setDelayComplete(false);
    }
  }, [isTyping]);

  useRandomInterval(
    typeNextChar,
    isTyping && delayComplete ? MIN_CHAR_INTERVAL : null,
    isTyping && delayComplete ? MAX_CHAR_INTERVAL : null
  );

  return { text: displayText, isVisible };
};
