import * as S from "./styles";
import { useState, useEffect } from "react";
import usePosCalc from "./usePosCalc";
import { useComputeCrossSimlarity } from "@/foundations/test/1-relation/utils/useComputeSimilarity";
import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";
import SingleRandom from "./SingleRandom";

import dynamic from "next/dynamic";

const Yakitori4 = dynamic(() => import("@/foundations/test/yakitori/0/0-4"));

const getRandom = (a, b) => Math.random() * (b - a) + a;

export default function Wrapper({ newInputEmbeddings, newOutputEmbeddings }) {
  const [isBlack, setIsBlack] = useState(false);

  useEffect(() => {
    //event listener mouse down-up
    document.addEventListener("mousedown", function () {
      setIsBlack(true);
    });
    document.addEventListener("mouseup", function () {
      setIsBlack(false);
    });
    //key
    document.addEventListener("keydown", function (e) {
      setIsBlack(true);
    });
    document.addEventListener("keyup", function (e) {
      setIsBlack(false);
    });

    return () => {
      document.removeEventListener("mousedown", function () {
        setIsBlack(true);
      });
      document.removeEventListener("mouseup", function () {
        setIsBlack(false);
      });
      document.removeEventListener("keydown", function (e) {
        setIsBlack(true);
      });
      document.removeEventListener("keyup", function (e) {
        setIsBlack(false);
      });
    };
  }, []);

  return (
    <>
      <S.Container
        style={{
          background: isBlack ? "black" : "white",
        }}
      >
        <SingleRandom newInputEmbeddings={newInputEmbeddings} newOutputEmbeddings={newOutputEmbeddings} isBlack={isBlack} range={{ x: [0, 1], y: [0, 1] }} visible={isBlack} />
        <SingleRandom newInputEmbeddings={newInputEmbeddings} newOutputEmbeddings={newOutputEmbeddings} isBlack={isBlack} range={{ x: [0.1, 0.9], y: [0.1, 0.9] }} visible={true} />
        <SingleRandom newInputEmbeddings={newInputEmbeddings} newOutputEmbeddings={newOutputEmbeddings} isBlack={isBlack} range={{ x: [0.2, 0.8], y: [0.2, 0.8] }} visible={isBlack} />
        <SingleRandom newInputEmbeddings={newInputEmbeddings} newOutputEmbeddings={newOutputEmbeddings} isBlack={isBlack} range={{ x: [0.3, 0.7], y: [0.3, 0.7] }} visible={isBlack} />
      </S.Container>
      <S.Container
        style={{
          opacity: isBlack ? 0 : 1,
        }}
      >
        <Yakitori4 enableDeviceControls={false} />
      </S.Container>
    </>
  );
}
