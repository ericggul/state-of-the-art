"use client";

import * as S from "./styles";
import React, { useState, useEffect, useRef } from "react";

export default function TextGrid() {
  const [time, setTime] = useState(0);
  const animationBegin = useRef(null);
  const timeInp = useRef(null);
  const cellMap = useRef([]);
  const root = useRef(null);

  const str = `
        /dream Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        /dream Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        /dream Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        /dream Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        /dream At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.
        /dream Et harum quidem rerum facilis est et expedita distinctio.
        /dream Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo.
        /dream Minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
        /dream Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates.
        /dream Repudiandae sint et molestiae non recusandae.
        /dream Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis.
        /dream Voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
    `;

  const sentences = str
    .split(/[\n\r]/)
    .filter((s) => s.length > 0)
    .map((s) => s + " ");

  const getCharAt = (x, y) => {
    const si = y % sentences.length;
    const ci = Math.min(x, sentences[si].length - 1);
    return sentences[si][ci];
  };

  const rows = 30;
  const cols = 100;

  const transform = (x, y, centerX, centerY, time) => {
    const dx = x - centerX;
    const dy = y - centerY;

    const dist = Math.sqrt(dx * dx + dy * dy);
    const currAngle = Math.atan2(dy, dx);
    const newAngle = currAngle - Math.pow(dist, 0.5) * time * 0.1;

    return [centerX + Math.cos(newAngle) * dist, centerY + Math.sin(newAngle) * dist];
  };

  const drawText = () => {
    const time = Number(timeInp.current.value);

    // Clear the screen.
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        cellMap.current[y][x].innerText = " ";
      }
    }

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let [nx, ny] = transform(x / cols, y / rows, 0.5, 0.5, time);
        nx = Math.floor(nx * cols);
        ny = Math.floor(ny * rows);
        if (nx < 0 || ny < 0 || ny >= rows || nx >= cols) continue;
        cellMap.current[ny][nx].innerText = getCharAt(x, y);
      }
    }
  };

  useEffect(() => {
    if (root.current) {
      for (let y = 0; y < rows; y++) {
        const row = document.createElement("div");
        root.current.appendChild(row);
        cellMap.current[y] = [];
        for (let x = 0; x < cols; x++) {
          const cell = document.createElement("div");
          cell.classList.add("cell");
          cell.setAttribute("data-row", row);
          cell.setAttribute("data-col", y);
          cell.innerText = getCharAt(x, y);
          row.appendChild(cell);
          cellMap.current[y][x] = cell;
        }
      }
    }

    const animate = () => {
      if (animationBegin.current == null) animationBegin.current = new Date();
      timeInp.current.value = (new Date() - animationBegin.current) / 1000;
      console.time("drawText");
      drawText();
      console.timeEnd("drawText");
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    const handleInput = () => drawText();
    timeInp.current.addEventListener("input", handleInput);

    return () => {
      timeInp.current.removeEventListener("input", handleInput);
    };
  }, []);

  return (
    <S.Container style={{ backgroundColor: "rgb(9,3,44)", color: "rgb(96,124,198)", fontSize: "10px" }}>
      <input type="range" defaultValue="0" min="0" max="120" step="0.001" ref={timeInp} />
      <S.TextGrid ref={root} style={{ fontFamily: "monospace" }} />
    </S.Container>
  );
}
