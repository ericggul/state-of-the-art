"use client";

import * as S from "./styles";
import React, { useState, useEffect, useRef, useMemo, act } from "react";

const getRandomDigit = () => Math.floor(Math.random() * 10);

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

  const [numbers, setNumbers] = useState(new Array(150).fill(0).map((_, i) => getRandomDigit()));

  useEffect(() => {
    if (!localActivated) return;
    const interval = setInterval(() => {
      setNumbers(numbers.map(() => getRandomDigit()));
    }, 20);

    return () => {
      clearInterval(interval);
    };
  }, [localActivated]);

  return (
    <S.Container>
      <S.InnerSVG
        style={{
          opacity: localActivated ? 1 : 0.05,
        }}
      >
        {new Array(100).fill(0).map((_, i) => (
          <SingleLine key={i} i={i} numbers={numbers} />
        ))}
      </S.InnerSVG>
    </S.Container>
  );
}

function SingleLine({ i, numbers }) {
  const sliceIdx = useMemo(() => (i * Math.floor(i ** 2 * 0.3 - i * 7)) % 100, [i]);

  const textEl = useMemo(() => (i !== 1000 ? numbers.slice(sliceIdx).concat(numbers.slice(0, sliceIdx)).join("") : "Lorem Ipsum "), [i, numbers, sliceIdx]);

  return (
    <text x="5" y={i * 20} color="white">
      {textEl}
    </text>
  );
}
