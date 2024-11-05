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
  startDelay = 0,
}) {
  const [displayText, setDisplayText] = useState("");
  const typingSynthRef = useRef(null);
  const [parts, setParts] = useState({
    name: "",
    dims: "",
    type: "",
    params: "",
    grid: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined" && enableSound) {
      typingSynthRef.current = new Tone.MembraneSynth().toDestination();
      typingSynthRef.current.volume.value = -20 - depth * 2;
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
    // Parse the text into parts
    const matches = {
      name: text.split("[")[0].trim(),
      dims: text.match(/\[(.*?)\]/)?.[0] || "",
      type: text.match(/<(.*?)>/)?.[0] || "",
      params: text.match(/\((.*?)\)/)?.[0] || "",
      grid: text.match(/\{(.*?)\}/)?.[0] || "",
    };

    let timeoutId;

    const startTyping = () => {
      let currentIndex = 0;
      const totalParts = Object.keys(matches).filter((k) => matches[k]).length;
      const partDelay = speed * 2;

      const typeNextPart = () => {
        const currentPart = Object.keys(matches)[currentIndex];
        if (!currentPart || !matches[currentPart]) {
          currentIndex++;
          if (currentIndex < Object.keys(matches).length) {
            timeoutId = setTimeout(typeNextPart, partDelay);
          }
          return;
        }

        let partText = matches[currentPart];
        let partIndex = 0;

        const typePartChar = () => {
          if (partIndex <= partText.length) {
            setParts((prev) => ({
              ...prev,
              [currentPart]: partText.substring(0, partIndex),
            }));
            if (partIndex > 0) playTypingSound();
            partIndex++;
            timeoutId = setTimeout(typePartChar, speed);
          } else {
            currentIndex++;
            if (currentIndex < Object.keys(matches).length) {
              timeoutId = setTimeout(typeNextPart, partDelay);
            }
          }
        };

        typePartChar();
      };

      typeNextPart();
    };

    timeoutId = setTimeout(startTyping, startDelay);
    return () => clearTimeout(timeoutId);
  }, [text, speed, startDelay]);

  return (
    <TypewriterContainer>
      {parts.name}
      {parts.dims && <span className="dims">{parts.dims}</span>}
      {parts.type && <span className="type">{parts.type}</span>}
      {parts.params && <span className="params">{parts.params}</span>}
      {parts.grid && <span className="grid">{parts.grid}</span>}
    </TypewriterContainer>
  );
}
