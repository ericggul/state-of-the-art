import * as S from "./styles";

import { useState, useEffect } from "react";

let TEST_TEXT = "안녕 클레오파트라, 세상에서 제일가는 포테이토칩!";
TEST_TEXT = "Lorem Ipsum made me crazy and I am not sure why.";

export default function UI({ handleTrain }) {
  const [expanded, setExpanded] = useState(false);
  const [inputText, setInputText] = useState(TEST_TEXT);

  function handleButtonClick() {
    setExpanded((ex) => !ex);
    // handleTrain();
  }

  //slider values
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);
  const [temperature, setTemperature] = useState(1);

  function handleTrainClick() {
    handleTrain({ text: inputText, params: { frequency_penalty: frequencyPenalty, temperature } });
  }

  return (
    <>
      {expanded && (
        <S.Modal>
          <S.Input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Input Text" />

          <S.Button onClick={handleTrainClick}>Train</S.Button>

          <p>Frequency Penalty: {frequencyPenalty}</p>
          <S.Slider type="range" min={-2} max={2} step={0.01} value={frequencyPenalty} onChange={(e) => setFrequencyPenalty(e.target.value)} />

          <p>Temperature: {temperature}</p>
          <S.Slider type="range" min={0} max={2} step={0.01} value={temperature} onChange={(e) => setTemperature(e.target.value)} />
        </S.Modal>
      )}

      <S.ModalButton onClick={handleButtonClick}>{expanded ? "X Close" : ">> Train Model"}</S.ModalButton>
    </>
  );
}
