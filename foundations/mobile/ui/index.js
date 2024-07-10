import * as S from "./styles";

import { useState, useEffect } from "react";

export default function UI({ handleTrainButtonClick }) {
  const [inputText, setInputText] = useState("");

  return (
    <S.Container>
      <S.Input value={inputText} onChange={(e) => setInputText(e.target.value)} />
      <S.TrainButton onClick={handleTrainButtonClick}>{">>"} Train Model</S.TrainButton>
    </S.Container>
  );
}
