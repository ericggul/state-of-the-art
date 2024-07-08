"use client";

import * as S from "./styles";
import React, { useState, useEffect, useRef } from "react";

const getRandomDigit = () => Math.floor(Math.random() * 10);

export default function TextGrid() {
  const [numbers, setNumbers] = useState(new Array(100).fill(0).map((_, i) => getRandomDigit()));

  useEffect(() => {
    const interval = setInterval(() => {
      setNumbers(numbers.map(() => getRandomDigit()));
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <S.Container>
      <S.InnerSVG>
        {new Array(100).fill(0).map((_, i) => (
          <text key={i} x="5" y={i * 20} color="white">
            {numbers.join("")}
          </text>
        ))}
      </S.InnerSVG>
    </S.Container>
  );
}
