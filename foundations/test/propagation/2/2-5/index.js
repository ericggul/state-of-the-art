"use client";

import * as S from "./styles";
import React, { useState, useEffect, useRef, useMemo } from "react";
import useResize from "@/utils/hooks/useResize";
import { getImageData, processImage } from "./utils";

import { ACCELERATION, XLEN, YLEN, getRandomMax } from "./const";

export default function TextGrid({ isTesting = false, activated = false }) {
  const [localActivated, setLocalActivated] = useState(activated);
  const iterationAfterActivatedRef = useRef(0);
  const [numbers, setNumbers] = useState(new Array(XLEN).fill(" "));
  const [testBlanks, setTestBlanks] = useState([]);

  useEffect(() => {
    setLocalActivated(activated);
  }, [activated]);

  useEffect(() => {
    if (!isTesting) return;
    const activate = () => setLocalActivated(true);
    const deactivate = () => setLocalActivated(false);
    document.addEventListener("keydown", activate);
    document.addEventListener("keyup", deactivate);

    return () => {
      document.removeEventListener("keydown", activate);
      document.removeEventListener("keyup", deactivate);
    };
  }, [isTesting]);

  useEffect(() => {
    if (!localActivated) {
      iterationAfterActivatedRef.current = 0;
      setNumbers(new Array(XLEN).fill(" "));
      return;
    }
    const interval = setInterval(() => {
      iterationAfterActivatedRef.current++;
      setNumbers((prevNumbers) => prevNumbers.map(() => getRandomMax(iterationAfterActivatedRef.current * ACCELERATION + 1)));
    }, 20);

    return () => {
      clearInterval(interval);
    };
  }, [localActivated]);

  useEffect(() => {
    async function fetchData() {
      const imageData = await getImageData("/images/grid/test.png");
      const processedResult = processImage(imageData, XLEN, YLEN);
      const blanks = [];

      for (let y = 0; y < YLEN; y++) {
        const row = [];
        let start = null;

        for (let x = 0; x < XLEN; x++) {
          if (processedResult[y][x] !== " " && start === null) {
            start = x;
          } else if (processedResult[y][x] === " " && start !== null) {
            row.push([start, x - 1]);
            start = null;
          }
        }
        if (start !== null) {
          row.push([start, XLEN - 1]);
        }
        blanks.push(row);
      }

      setTestBlanks(blanks);
    }

    fetchData();
  }, []);

  const [windowWidth, windowHeight] = useResize();

  return (
    <S.Container>
      <S.InnerSVG style={{ opacity: localActivated ? 1 : 0.05 }}>
        {new Array(YLEN).fill(0).map((_, i) => (
          <SingleLine key={i} i={i} numbers={numbers} yInterval={windowHeight * 0.02} testBlanks={testBlanks} />
        ))}
      </S.InnerSVG>
    </S.Container>
  );
}

function SingleLine({ i, numbers, yInterval, testBlanks }) {
  const sliceIdx = useMemo(() => ((i * Math.floor(i ** 2 * 0.3 - i * 7)) % 100) + Math.floor(30 * Math.sin(i * 0.7 + i ** 1.3)), [i]);

  const textEl = useMemo(() => {
    const slicedArr = numbers.slice(sliceIdx).concat(numbers.slice(0, sliceIdx));
    const targetBlanks = testBlanks[i] || [];
    const res = slicedArr.map((el, idx) => {
      const isBlank = targetBlanks.some(([start, end]) => idx >= start && idx <= end);
      return isBlank ? el : " ";
    });
    return res.join("");
  }, [i, numbers, sliceIdx, testBlanks]);

  return (
    <text
      x="0"
      y={i * yInterval}
      style={{
        fill: `hsl(${200 + i * 1.5}, 100%, 90%)`,
      }}
    >
      {textEl}
    </text>
  );
}
