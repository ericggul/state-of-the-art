import React from "react";
import TypewriterText from "../TypewriterText";
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
                <TypewriterText text={highlight} speed={20} />
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
                <TypewriterText text={limitation} speed={20} />
              </S.Item>
            ))}
          </S.List>
        </S.Section>
      )}
    </S.Container>
  );
}
