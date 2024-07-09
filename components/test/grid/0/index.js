"use client";

import * as S from "./styles";
import React, { useState, useEffect, useRef, useMemo, act } from "react";
import useResize from "@/utils/hooks/useResize";

const getRandomDigit = () => {
  let res = Math.floor(Math.random() * 10);
  return res == 0 ? " " : res;
};

export default function TextGrid({ isTesting = false, activated = false }) {
  const [localActivated, setLocalActivated] = useState(activated);

  useEffect(() => {
    setLocalActivated(activated);
  }, [activated]);

  useEffect(() => {
    if (!isTesting) return;
    document.addEventListener("keydown", () => setLocalActivated(true));
    document.addEventListener("keyup", () => setLocalActivated(false));

    return () => {
      document.removeEventListener("keydown", () => setLocalActivated(true));
      document.removeEventListener("keyup", () => setLocalActivated(false));
    };
  }, [isTesting]);

  const [numbers, setNumbers] = useState(new Array(200).fill(0).map((_, i) => getRandomDigit()));

  useEffect(() => {
    if (!localActivated) return;
    const interval = setInterval(() => {
      setNumbers(numbers.map(() => getRandomDigit()));
    }, 20);

    return () => {
      clearInterval(interval);
    };
  }, [localActivated]);

  const [windowWidth, windowHeight] = useResize();

  return (
    <S.Container>
      <S.InnerSVG
        style={{
          opacity: localActivated ? 1 : 0.05,
        }}
      >
        {new Array(50).fill(0).map((_, i) => (
          <SingleLine key={i} i={i} numbers={numbers} yInterval={windowHeight * 0.02} />
        ))}
      </S.InnerSVG>
    </S.Container>
  );
}

function SingleLine({ i, numbers, yInterval }) {
  const sliceIdx = useMemo(() => ((i * Math.floor(i ** 2 * 0.3 - i * 7)) % 100) + Math.floor(30 * Math.sin(i * 0.7 + i ** 1.3)), [i]);

  const textEl = useMemo(() => (i !== 1000 ? numbers.slice(sliceIdx).concat(numbers.slice(0, sliceIdx)).join("") : "Lorem Ipsum "), [i, numbers, sliceIdx]);

  return (
    <text x="5" y={i * yInterval} color="white">
      {textEl}
    </text>
  );
}
