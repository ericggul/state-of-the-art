import React from "react";
import TextScramble from "@/foundations/pc/utils/TextScramble";
import { DEFAULT_MODEL } from "../../utils/constants";
import * as S from "./styles";

export default function ModelFeatures({ model, isHighlight = true }) {
  const currentModel = model || DEFAULT_MODEL;
  const highlights = currentModel.highlights || [];
  const limitations = currentModel.limitations || [];

  return (
    <S.Container>
      {isHighlight && (
        <S.Section>
          <S.Title>Highlights</S.Title>
          <S.List>
            {highlights.map((highlight, index) => (
              <S.Item key={index}>
                <S.Bullet $isHighlight>+</S.Bullet>
                <S.TextWrapper>
                  <TextScramble text={highlight} speed={1.5} />
                </S.TextWrapper>
              </S.Item>
            ))}
          </S.List>
        </S.Section>
      )}

      {!isHighlight && (
        <S.Section>
          <S.Title>Limitations</S.Title>
          <S.List>
            {limitations.map((limitation, index) => (
              <S.Item key={index}>
                <S.Bullet $isHighlight={false}>-</S.Bullet>
                <S.TextWrapper>
                  <TextScramble text={limitation} speed={1.5} />
                </S.TextWrapper>
              </S.Item>
            ))}
          </S.List>
        </S.Section>
      )}
    </S.Container>
  );
}
