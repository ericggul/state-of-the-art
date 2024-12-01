import React, { useState, useEffect } from "react";
import * as S from "./styles";

const TEXT = `You are currently seeing GPT's Token Embeddings Visualisation in real-time - depicting the chaotic vectorised cross-similarity relationship of LLMs.`;

function Transcript({ isblack }) {
  const [displayMessage, setDisplayMessage] = useState(TEXT);

  return (
    <S.Text
      style={
        {
          // color: isblack ? "#fff" : "#000",
        }
      }
    >
      {displayMessage}
    </S.Text>
  );
}

export default React.memo(Transcript);
