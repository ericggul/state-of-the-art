import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import * as Tone from "tone";

const TypewriterContainer = styled.span`
  display: inline-block;
  min-width: 1ch;
`;

export default function TypewriterLayerText({
  text,
  speed = 30,
  depth = 0,
  enableSound = true,
}) {
  const [displayText, setDisplayText] = useState("");
  const typingSynthRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && enableSound) {
      typingSynthRef.current = new Tone.MembraneSynth().toDestination();
      typingSynthRef.current.volume.value = -20 - depth * 2; // Quieter for deeper layers
    }
    return () => {
      if (typingSynthRef.current) typingSynthRef.current.dispose();
    };
  }, []);

  const playTypingSound = () => {
    if (typingSynthRef.current && enableSound) {
      try {
        typingSynthRef.current.triggerAttackRelease(`C${3 + depth}`, "32n");
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    let currentIndex = 0;
    let timeoutId;

    const typeWriter = () => {
      if (currentIndex <= text.length) {
        setDisplayText(text.substring(0, currentIndex));
        if (currentIndex > 0) playTypingSound();
        currentIndex++;
        timeoutId = setTimeout(typeWriter, speed);
      }
    };

    typeWriter();
    return () => clearTimeout(timeoutId);
  }, [text, speed]);

  return <TypewriterContainer>{displayText || "\u00A0"}</TypewriterContainer>;
}
