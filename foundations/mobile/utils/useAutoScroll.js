// useAutoScroll.js
import { useRef, useEffect } from "react";

export const useAutoScroll = (dependencies) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, dependencies);

  return messagesEndRef;
};
