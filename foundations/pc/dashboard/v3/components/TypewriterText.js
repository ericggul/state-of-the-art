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
  const erasingSynthRef = useRef(null);

  useEffect(() => {
    // Initialize Tone.js and create synths only on client-side
    if (typeof window !== "undefined") {
      typingSynthRef.current = new Tone.MembraneSynth().toDestination();
      typingSynthRef.current.volume.value = -10;

      erasingSynthRef.current = new Tone.MembraneSynth().toDestination();
      erasingSynthRef.current.volume.value = -12;
    }

    return () => {
      if (typingSynthRef.current) typingSynthRef.current.dispose();
      if (erasingSynthRef.current) erasingSynthRef.current.dispose();
    };
  }, []);

  const playTypingSound = () => {
    if (typingSynthRef.current) {
      try {
        // typingSynthRef.current.triggerAttackRelease("C2", "16n");
      } catch (e) {
        console.log(e);
      }
    }
  };

  const playErasingSound = () => {
    if (erasingSynthRef.current) {
      try {
        // erasingSynthRef.current.triggerAttackRelease("A1", "16n");
        typingSynthRef.current.triggerAttackRelease("C2", "16n");
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
        // if (index > previousText.current.length) {
        //   playTypingSound();
        // }
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
          // playErasingSound();
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
