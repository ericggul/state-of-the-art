import { useState, useEffect, useCallback } from "react";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

const MIN_CHAR_INTERVAL = 30; // ms
const MAX_CHAR_INTERVAL = 80; // ms

export const useTypewriter = (text, isTyping) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const typeNextChar = useCallback(() => {
    if (currentIndex <= text.length) {
      setDisplayText(text.slice(0, currentIndex));
      setCurrentIndex((prev) => prev + 1);
      return true; // continue typing
    }
    return false; // stop typing
  }, [currentIndex, text]);

  // Reset when isTyping changes
  useEffect(() => {
    if (!isTyping) {
      setDisplayText("");
      setCurrentIndex(0);
    }
  }, [isTyping]);

  // Random interval typing
  useRandomInterval(
    typeNextChar,
    isTyping ? MIN_CHAR_INTERVAL : null,
    isTyping ? MAX_CHAR_INTERVAL : null
  );

  return displayText;
};
