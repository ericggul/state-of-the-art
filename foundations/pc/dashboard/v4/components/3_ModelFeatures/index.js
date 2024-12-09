import React from "react";
import { animated, useTrail, config } from "@react-spring/web";
import TextScramble from "@/foundations/pc/utils/TextScramble";
import { DEFAULT_MODEL } from "../../utils/constants";
import * as S from "./styles";

export default function ModelFeatures({ model, isHighlight = true, hue }) {
  const currentModel = model || DEFAULT_MODEL;
  const highlights = currentModel.highlights || [];
  const limitations = currentModel.limitations || [];
  const items = isHighlight ? highlights : limitations;
  const modelKey = model?.name || "default";

  const itemTrail = useTrail(items.length, {
    from: {
      opacity: 0,
      transform: "translateX(3vw)",
      filter: "blur(10px) brightness(1.3)",
    },
    to: {
      opacity: 1,
      transform: "translateX(0px)",
      filter: "blur(0px) brightness(1)",
    },
    config: {
      tension: 430,
      friction: 40,
      mass: 1,
      clamp: true,
    },
    reset: true,
    immediate: false,
    key: `${modelKey}-${isHighlight}`,
  });

  return (
    <S.Container>
      <S.Section $hue={hue}>
        <S.Title $hue={hue}>
          {isHighlight ? "Highlights" : "Limitations"}
        </S.Title>
        <S.List>
          {itemTrail.map((style, index) => (
            <S.AnimatedItem
              key={index}
              style={style}
              $hue={hue}
              $delay={index * 80}
            >
              <S.Bullet $isHighlight={isHighlight} $hue={hue}>
                {isHighlight ? "+" : "-"}
              </S.Bullet>
              <S.TextWrapper>
                <TextScramble text={items[index]} speed={1.5} />
              </S.TextWrapper>
            </S.AnimatedItem>
          ))}
        </S.List>
      </S.Section>
    </S.Container>
  );
}
