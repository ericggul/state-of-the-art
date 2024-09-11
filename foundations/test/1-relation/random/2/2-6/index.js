import * as S from "./styles";
import { useState, useEffect } from "react";
import SingleRandom from "./SingleRandom";

import useAudio from "./useAudio";

export default function Wrapper({ newInputEmbeddings, newOutputEmbeddings }) {
  const [isBlack, setIsBlack] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlack((prev) => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useAudio({ isBlack });

  return (
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
  );
}
