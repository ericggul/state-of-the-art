import * as S from "./styles";

import { useState, useEffect } from "react";

export default function UI({ handleTrain }) {
  const [expanded, setExpanded] = useState(false);
  const [inputText, setInputText] = useState("");

  function handleButtonClick() {
    setExpanded((ex) => !ex);
    // handleTrain();
  }

  return (
    <>
      {expanded && (
        <S.Modal>
          <S.Input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Input Text" />
          <S.Button onClick={() => handleTrain(inputText)}>Train</S.Button>
        </S.Modal>
      )}

      <S.TrainButton onClick={handleButtonClick}>{expanded ? "X Close" : ">> Train Model"}</S.TrainButton>
    </>
  );
}
