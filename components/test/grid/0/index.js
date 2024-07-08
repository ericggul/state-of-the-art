"use client";

import * as S from "./styles";
import React, { useState, useEffect, useRef } from "react";

const getRandomDigit = () => Math.floor(Math.random() * 10);

export default function TextGrid() {
  const [keyPressing, setKeyPressing] = useState(false);

  useEffect(() => {
    document.addEventListener("keydown", () => setKeyPressing(true));
    document.addEventListener("keyup", () => setKeyPressing(false));

    return () => {
      document.removeEventListener("keydown", () => setKeyPressing(true));
      document.removeEventListener("keyup", () => setKeyPressing(false));
    };
  }, []);

  const [numbers, setNumbers] = useState(new Array(100).fill(0).map((_, i) => getRandomDigit()));

  useEffect(() => {
    if (!keyPressing) return;
    const interval = setInterval(() => {
      setNumbers(numbers.map(() => getRandomDigit()));
    }, 20);

    return () => {
      clearInterval(interval);
    };
  }, [keyPressing]);

  return (
    <S.Container>
      <S.InnerSVG
        style={{
          opacity: keyPressing ? 1 : 0.05,
        }}
      >
        {new Array(100).fill(0).map((_, i) => (
          <text key={i} x="5" y={i * 20} color="white">
            {
              // numbers
              numbers
                .slice((i * Math.floor(i ** 2 * 0.3 - i * 7)) % 100)
                .concat(numbers.slice(0, (i * Math.floor(i ** 2 * 0.3 - i * 7)) % 100))

                .join("")
            }
          </text>
        ))}
      </S.InnerSVG>
    </S.Container>
  );
}
