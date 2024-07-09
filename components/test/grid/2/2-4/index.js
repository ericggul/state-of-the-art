"use client";

import * as S from "./styles";
import React, { useState, useEffect, useRef, useMemo, act } from "react";
import useResize from "@/utils/hooks/useResize";

import { animateBlanks, ACCELERATION, XLEN, YLEN, getRandomMax } from "./const";

export default function TextGrid({ isTesting = false, activated = false }) {
  const [localActivated, setLocalActivated] = useState(activated);
  const iterationAfterActivatedRef = useRef(0);

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

  const [numbers, setNumbers] = useState(new Array(XLEN).fill(0).map((_, i) => getRandomMax(iterationAfterActivatedRef.current * ACCELERATION + 0.95)));

  useEffect(() => {
    if (!localActivated) {
      iterationAfterActivatedRef.current = 0;
      setNumbers(new Array(XLEN).fill(" "));
      return;
    }
    const interval = setInterval(() => {
      iterationAfterActivatedRef.current++;
      setNumbers(numbers.map(() => getRandomMax(iterationAfterActivatedRef.current * ACCELERATION + 0.95)));
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
        {new Array(YLEN).fill(0).map((_, i) => (
          <SingleLine key={i} i={i} numbers={numbers} yInterval={windowHeight * 0.02} iterationAfterActivatedRef={iterationAfterActivatedRef} />
        ))}
      </S.InnerSVG>
    </S.Container>
  );
}

function SingleLine({ i, numbers, yInterval, iterationAfterActivatedRef }) {
  const sliceIdx = useMemo(() => ((i * Math.floor(i ** 2 * 0.3 - i * 7)) % 100) + Math.floor(30 * Math.sin(i * 0.7 + i ** 1.3)), [i]);
  const textEl = useMemo(() => {
    const slicedArr = numbers.slice(sliceIdx).concat(numbers.slice(0, sliceIdx));
    const targetBlanks = animateBlanks(iterationAfterActivatedRef.current)[i];

    const res = slicedArr.map((el, idx) => {
      const isBlank = targetBlanks.some(([start, end]) => idx >= start && idx <= end);
      return isBlank ? el : " ";
    });
    return res.join("");
  }, [i, numbers, sliceIdx]);

  return (
    <text x="0" y={i * yInterval} color="white">
      {textEl}
    </text>
  );
}
