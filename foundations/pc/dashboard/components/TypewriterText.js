import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import * as Tone from "tone";

const TypewriterContainer = styled.span`
  display: inline-block;
  min-width: 1ch;
  min-height: 1.2em;
`;

export default React.memo(function TypewriterText({
  text,
  speed = 50,
  depth = 0,
  enableSound = true,
  startDelay = 0,
}) {
  const [displayText, setDisplayText] = useState("");

  const lastPlayedTime = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    let isActive = true;

    const typeWriter = (fullText, index = 0) => {
      if (!isActive) return;

      if (index <= fullText.length) {
        setDisplayText(fullText.substring(0, index));

        timeoutRef.current = setTimeout(
          () => typeWriter(fullText, index + 1),
          speed
        );
      }
    };

    timeoutRef.current = setTimeout(() => typeWriter(text), startDelay);

    return () => {
      isActive = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed, startDelay]);

  return <TypewriterContainer>{displayText || "\u00A0"}</TypewriterContainer>;
});
