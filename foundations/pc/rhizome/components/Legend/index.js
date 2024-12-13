import React from "react";
import TextScramble from "@/foundations/pc/utils/TextScramble";
import * as S from "./styles";

export default function Legend({ hue }) {
  return (
    <S.LegendContainer $hue={hue}>
      <S.Title>
        <TextScramble text="AI Architecture Relation Map" />
      </S.Title>

      <S.LegendItem>
        <S.IndicatorWrapper>
          <S.Circle $type="highlight" $hue={hue} />
        </S.IndicatorWrapper>
        <S.Text $hue={hue}>Selected Architecture</S.Text>
      </S.LegendItem>

      <S.LegendItem>
        <S.IndicatorWrapper>
          <S.Circle $type="node" $hue={hue} />
        </S.IndicatorWrapper>
        <S.Text $hue={hue}>Related Architectures</S.Text>
      </S.LegendItem>

      <S.LegendItem>
        <S.IndicatorWrapper>
          <S.Circle $type="other" $hue={hue} />
        </S.IndicatorWrapper>
        <S.Text $hue={hue}>All Other Architectures</S.Text>
      </S.LegendItem>

      <S.LegendItem>
        <S.IndicatorWrapper>
          <S.Line $type="connection" $hue={hue} />
        </S.IndicatorWrapper>
        <S.Text $hue={hue}>Influence Relationship</S.Text>
      </S.LegendItem>
    </S.LegendContainer>
  );
}
