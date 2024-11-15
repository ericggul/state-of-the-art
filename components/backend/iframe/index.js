"use client";

import React, { useState, useEffect, useCallback } from "react";
import * as S from "./styles";
import useBackendStore from "@/components/backend/store";

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

function IframeComponent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isblack = useBackendStore((state) => state.isblack);

  useEffect(() => {
    if (isblack) {
      const randomIndex = Math.floor(Math.random() * KEYWORDS.length);
      setCurrentIndex(randomIndex);
    }
  }, [isblack]);

  const currentLink = useCallback(() => {
    return KEYWORDS[currentIndex] === "__NAMU__"
      ? NAMU_LINK
      : `${BASE_URL}${KEYWORDS[currentIndex]}`;
  }, [currentIndex]);

  const currentTitle = useCallback(() => {
    return KEYWORDS[currentIndex] === "__NAMU__"
      ? "Namu Wiki - Abstract Expressionism"
      : `Wikipedia - ${KEYWORDS[currentIndex].replace(/_/g, " ")}`;
  }, [currentIndex]);

  return (
    <>
      <S.IframeContainer
        style={{
          opacity: isblack ? 0 : 1,
          visibility: isblack ? "hidden" : "visible",
        }}
      >
        <S.StyledIframe
          src={currentLink()}
          title={currentTitle()}
          allowFullScreen
        />
      </S.IframeContainer>
      <S.YoutubeOverlay
        style={{
          opacity: isblack ? 1 : 0,
        }}
      >
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

export default React.memo(IframeComponent);
