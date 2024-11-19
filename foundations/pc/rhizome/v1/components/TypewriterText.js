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
  const typingSynthRef = useRef(null);
  const lastPlayedTime = useRef(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      typingSynthRef.current = new Tone.MembraneSynth().toDestination();
      typingSynthRef.current.volume.value = -20;
    }

    return () => {
      if (typingSynthRef.current) typingSynthRef.current.dispose();
    };
  }, []);

  const playTypingSound = () => {
    if (typingSynthRef.current) {
      const now = Date.now();
      if (now - lastPlayedTime.current < 30) return;

      try {
        typingSynthRef.current.triggerAttackRelease("C2", "32n");
        lastPlayedTime.current = now;
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    if (text === previousText.current) return;

    const typeWriter = (fullText, index = 0) => {
      if (index <= fullText.length) {
        setDisplayText(fullText.substring(0, index));
        if (index > previousText.current.length && index % 2 === 0) {
          playTypingSound();
        }
        timeoutRef.current = setTimeout(
          () => typeWriter(fullText, index + 1),
          speed
        );
      } else {
        previousText.current = fullText;
      }
    };

    typeWriter(text);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed]);

  return <TypewriterContainer>{displayText || "\u00A0"}</TypewriterContainer>;
}
