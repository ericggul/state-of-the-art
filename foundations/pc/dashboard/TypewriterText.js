import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import * as Tone from "tone";

const TypewriterContainer = styled.span`
  display: inline-block;
  min-width: 1ch;
  min-height: 1.2em;
`;

export default function TypewriterText({ text, speed = 50 }) {
  const [displayText, setDisplayText] = useState("");
  const previousText = useRef("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (text === previousText.current) return;

    const typeWriter = (fullText, index = 0) => {
      if (index <= fullText.length) {
        setDisplayText(fullText.substring(0, index));
        timeoutRef.current = setTimeout(
          () => typeWriter(fullText, index + 1),
          speed
        );
      } else {
        previousText.current = fullText;
      }
    };

    if (previousText.current.length > 0) {
      const eraseWriter = (index = previousText.current.length) => {
        if (index > 0) {
          setDisplayText(previousText.current.substring(0, index));
          timeoutRef.current = setTimeout(
            () => eraseWriter(index - 1),
            speed / 2
          );
        } else {
          typeWriter(text);
        }
      };
      eraseWriter();
    } else {
      typeWriter(text);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed]);

  return <TypewriterContainer>{displayText || "\u00A0"}</TypewriterContainer>;
}
