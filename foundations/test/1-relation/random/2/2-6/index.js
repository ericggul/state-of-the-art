import * as S from "./styles";
import { useState, useEffect } from "react";
import SingleRandom from "./SingleRandom";

import useAudio from "./useAudio";

import useRandomInterval from "@/utils/hooks/intervals/useRandomInterval";

export default function Wrapper({ newInputEmbeddings, newOutputEmbeddings }) {
  const [isblack, setIsblack] = useState(true);

  useRandomInterval(
    () => {
      setIsblack((prev) => !prev);
    },
    2000,
    7000
  );

  useAudio({ isblack });

  return (
    <S.Container
      style={{
        background: isblack ? "black" : "white",
      }}
    >
      <SingleRandom
        newInputEmbeddings={newInputEmbeddings}
        newOutputEmbeddings={newOutputEmbeddings}
        isblack={isblack}
        range={{ x: [0, 1], y: [0, 1] }}
        visible={isblack}
      />
      <SingleRandom
        newInputEmbeddings={newInputEmbeddings}
        newOutputEmbeddings={newOutputEmbeddings}
        isblack={isblack}
        range={{ x: [0.1, 0.9], y: [0.1, 0.9] }}
        visible={true}
      />
      <SingleRandom
        newInputEmbeddings={newInputEmbeddings}
        newOutputEmbeddings={newOutputEmbeddings}
        isblack={isblack}
        range={{ x: [0.2, 0.8], y: [0.2, 0.8] }}
        visible={isblack}
      />
      <SingleRandom
        newInputEmbeddings={newInputEmbeddings}
        newOutputEmbeddings={newOutputEmbeddings}
        isblack={isblack}
        range={{ x: [0.3, 0.7], y: [0.3, 0.7] }}
        visible={isblack}
      />
    </S.Container>
  );
}
