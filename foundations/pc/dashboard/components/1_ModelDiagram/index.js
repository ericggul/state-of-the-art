import React from "react";
import { animated, useTrail, config } from "@react-spring/web";
import { DEFAULT_MODEL } from "../../utils/constants";
import * as S from "./styles";

export default function ModelDiagram({ model, hue }) {
  const architecture = model?.architecture || DEFAULT_MODEL.architecture || [];
  const modelKey = model?.name || "default";

  // Create cascading animations for layers and arrows
  const layerTrail = useTrail(architecture.length, {
    from: {
      opacity: 0,
      transform: "scale(0.7) translateX(-20px)",
      filter: "blur(10px) brightness(2)",
    },
    to: {
      opacity: 1,
      transform: "scale(1) translateX(0px)",
      filter: "blur(0px) brightness(1)",
    },
    config: {
      tension: 340,
      friction: 26,
    },
    reset: true,
    key: modelKey, // Reset animation when model changes
  });

  const arrowTrail = useTrail(architecture.length - 1, {
    from: {
      opacity: 0,
      transform: "translateY(-10px) scale(0.5)",
      filter: "blur(5px) brightness(2)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0px) scale(1)",
      filter: "blur(0px) brightness(1)",
    },
    config: {
      tension: 400,
      friction: 28,
    },
    delay: 150, // Slight delay after layers start animating
    reset: true,
    key: modelKey,
  });

  return (
    <S.Container>
      {layerTrail.map((style, index) => (
        <React.Fragment key={`${modelKey}-${architecture[index]}-${index}`}>
          <S.AnimatedLayer style={style} $hue={hue} $index={index}>
            <S.LayerContent>
              {architecture[index].toUpperCase()}
              <S.LayerGlow $hue={hue} />
            </S.LayerContent>
          </S.AnimatedLayer>
          {index < architecture.length - 1 && (
            <S.AnimatedArrow
              style={arrowTrail[index]}
              $hue={hue}
              $index={index}
            />
          )}
        </React.Fragment>
      ))}
    </S.Container>
  );
}
