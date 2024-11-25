import { useState, useEffect, useCallback, useRef } from "react";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

const MIN_CHAR_INTERVAL = 30;
const MAX_CHAR_INTERVAL = 80;

export const useTypewriter = (text, isTyping) => {
  const [displayText, setDisplayText] = useState("");
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
      setDisplayText("");
      indexRef.current = 0;
    }
  }, [isTyping]);

  useRandomInterval(
    typeNextChar,
    isTyping ? MIN_CHAR_INTERVAL : null,
    isTyping ? MAX_CHAR_INTERVAL : null
  );

  return displayText;
};
