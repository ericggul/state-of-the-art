import React, { useState, useEffect } from "react";
import { animated, useTransition } from "@react-spring/web";
import TextScramble from "@/foundations/pc/utils/TextScramble";
import * as S from "./styles";

const IMAGE_BASE = "/db/images/";

export default function ModelImage({ model }) {
  const [currentImage, setCurrentImage] = useState(model?.image || "g1.png");

  const transitions = useTransition(currentImage, {
    from: {
      opacity: 0,
      transform: "scale(1.2) translateY(-20px)",
      filter: "brightness(2) blur(20px) hue-rotate(90deg)",
    },
    enter: {
      opacity: 1,
      transform: "scale(1) translateY(0px)",
      filter: "brightness(0.9) blur(0px) hue-rotate(0deg)",
    },
    leave: {
      opacity: 0,
      transform: "scale(0.8) translateY(20px)",
      filter: "brightness(0.5) blur(10px) hue-rotate(-90deg)",
    },
    config: {
      tension: 340,
      friction: 26,
    },
  });

  useEffect(() => {
    if (model?.image) {
      setCurrentImage(model.image);
    }
  }, [model?.image]);

  return (
    <S.Container>
      <S.ImageWrapper>
        <S.ScanLine />
        <S.GlowOverlay />
        {transitions((style, item) => (
          <S.AnimatedImage
            style={style}
            src={IMAGE_BASE + item}
            alt={model?.name || "Model Image"}
            onError={(e) => {
              e.target.src = IMAGE_BASE + "g1.png";
            }}
          />
        ))}
      </S.ImageWrapper>
      <S.Description>
        <TextScramble text={model?.explanation || ""} speed={2.5} />
      </S.Description>
    </S.Container>
  );
}
