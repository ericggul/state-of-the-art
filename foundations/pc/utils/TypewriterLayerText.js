import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import * as Tone from "tone";

const TypewriterContainer = styled.span`
  display: inline-block;
  min-width: 1ch;
`;

export default React.memo(function TypewriterLayerText({
  text,
  speed = 30,
  depth = 0,
  enableSound = true,
  startDelay = 0,
}) {
  const typingSynthRef = useRef(null);
  const lastPlayedTime = useRef(0);
  const [parts, setParts] = useState({
    name: "",
    dims: "",
    type: "",
    params: "",
    grid: "",
  });

  // Memoize text parsing
  const matches = React.useMemo(
    () => ({
      name: text.split("[")[0].trim(),
      dims: text.match(/\[(.*?)\]/)?.[0] || "",
      type: text.match(/<(.*?)>/)?.[0] || "",
      params: text.match(/\((.*?)\)/)?.[0] || "",
      grid: text.match(/\{(.*?)\}/)?.[0] || "",
    }),
    [text]
  );

  // Memoize sound setup
  const setupSound = React.useCallback(() => {
    if (typeof window !== "undefined" && enableSound) {
      typingSynthRef.current = new Tone.MembraneSynth().toDestination();
      typingSynthRef.current.volume.value = -20 - depth * 2;
    }
  }, [enableSound, depth]);

  useEffect(() => {
    setupSound();
    return () => typingSynthRef.current?.dispose();
  }, [setupSound]);

  const playTypingSound = () => {
    if (typingSynthRef.current && enableSound) {
      const now = Date.now();
      if (now - lastPlayedTime.current < 30) return;

      try {
        typingSynthRef.current.triggerAttackRelease(`C${3 + depth}`, "32n");
        lastPlayedTime.current = now;
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    let timeoutId;
    let isActive = true;

    const startTyping = () => {
      let currentIndex = 0;
      const partDelay = speed * 2;

      const typeNextPart = () => {
        if (!isActive) return;

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
          if (!isActive) return;

          if (partIndex <= partText.length) {
            setParts((prev) => ({
              ...prev,
              [currentPart]: partText.substring(0, partIndex),
            }));
            // if (partIndex > 0 && partIndex % 2 === 0) {
            //   playTypingSound();
            // }
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
    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [text, speed, startDelay, matches]);

  return (
    <TypewriterContainer>
      {parts.name}
      {parts.dims && <span className="dims">{parts.dims}</span>}
      {parts.type && <span className="type">{parts.type}</span>}
      {parts.params && <span className="params">{parts.params}</span>}
      {parts.grid && <span className="grid">{parts.grid}</span>}
    </TypewriterContainer>
  );
});
