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
  const [isblack, setIsblack] = useState(false);

  useEffect(() => {
    //event listener mouse down-up
    document.addEventListener("mousedown", function () {
      setIsblack(true);
    });
    document.addEventListener("mouseup", function () {
      setIsblack(false);
    });
    //key
    document.addEventListener("keydown", function (e) {
      setIsblack(true);
    });
    document.addEventListener("keyup", function (e) {
      setIsblack(false);
    });

    return () => {
      document.removeEventListener("mousedown", function () {
        setIsblack(true);
      });
      document.removeEventListener("mouseup", function () {
        setIsblack(false);
      });
      document.removeEventListener("keydown", function (e) {
        setIsblack(true);
      });
      document.removeEventListener("keyup", function (e) {
        setIsblack(false);
      });
    };
  }, []);

  return (
    <>
      <S.Container
        style={{
          background: isblack ? "black" : "white",
        }}
      >
        <SingleRandom newInputEmbeddings={newInputEmbeddings} newOutputEmbeddings={newOutputEmbeddings} isblack={isblack} range={{ x: [0, 1], y: [0, 1] }} visible={isblack} />
        <SingleRandom newInputEmbeddings={newInputEmbeddings} newOutputEmbeddings={newOutputEmbeddings} isblack={isblack} range={{ x: [0.1, 0.9], y: [0.1, 0.9] }} visible={true} />
        <SingleRandom newInputEmbeddings={newInputEmbeddings} newOutputEmbeddings={newOutputEmbeddings} isblack={isblack} range={{ x: [0.2, 0.8], y: [0.2, 0.8] }} visible={isblack} />
        <SingleRandom newInputEmbeddings={newInputEmbeddings} newOutputEmbeddings={newOutputEmbeddings} isblack={isblack} range={{ x: [0.3, 0.7], y: [0.3, 0.7] }} visible={isblack} />
      </S.Container>
      <S.Container
        style={{
          opacity: isblack ? 0 : 1,
        }}
      >
        <Yakitori4 enableDeviceControls={false} />
      </S.Container>
    </>
  );
}
