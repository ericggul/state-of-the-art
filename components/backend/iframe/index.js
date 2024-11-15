"use client";

import React, { useState, useEffect } from "react";
import * as S from "./styles";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

const KEYWORDS = [
  "Abstract_expressionism",
  "Jackson_Pollock",
  "Willem_de_Kooning",
  "Franz_Kline",
  "Mark_Rothko",
  "Robert_Motherwell",
  "Barnett_Newman",
  "Adolph_Gottlieb",
  "Morris_Louis",
  "Joan_Miró",
  "Modernism",
  "Clement_Greenberg",
  "__NAMU__",
];

const BASE_URL = "https://en.wikipedia.org/wiki/";
const NAMU_LINK =
  "https://namu.wiki/w/%EC%B6%94%EC%83%81%ED%91%9C%ED%98%84%EC%A3%BC%EC%9D%98";
const YOUTUBE_ID = "RUToUxvnv3I";

export default function IframeComponent() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useRandomInterval(
    () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % KEYWORDS.length);
    },
    100,
    500
  );

  const currentLink =
    KEYWORDS[currentIndex] === "__NAMU__"
      ? NAMU_LINK
      : `${BASE_URL}${KEYWORDS[currentIndex]}`;

  return (
    <>
      {/* <S.IframeContainer>
        <S.StyledIframe
          src={currentLink}
          title={
            KEYWORDS[currentIndex] === "__NAMU__"
              ? "Namu Wiki - Abstract Expressionism"
              : `Wikipedia - ${KEYWORDS[currentIndex].replace(/_/g, " ")}`
          }
          allowFullScreen
        />
      </S.IframeContainer> */}
      <S.YoutubeOverlay>
        <S.YoutubeIframe
          src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${YOUTUBE_ID}`}
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </S.YoutubeOverlay>
    </>
  );
}
