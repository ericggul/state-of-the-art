import React from "react";
import TokenComponent from "../../components/TokenComponent";

export function TokensRenderer({
  inputTokens,
  outputTokens,
  inputPosCalc,
  outputPosCalc,
  highlightIdx,
}) {
  return (
    <>
      {inputTokens.map((token, i) => (
        <TokenComponent
          key={`input-${i}`}
          i={i}
          token={token}
          wordPosCalc={inputPosCalc.wordPosCalc}
          wordInterval={inputPosCalc.wordInterval}
          highlightIdx={highlightIdx}
        />
      ))}

      {outputTokens.map((token, i) => (
        <TokenComponent
          key={`output-${i}`}
          i={i}
          token={token}
          wordPosCalc={outputPosCalc.wordPosCalc}
          wordInterval={outputPosCalc.wordInterval}
          highlightIdx={highlightIdx}
        />
      ))}
    </>
  );
}
