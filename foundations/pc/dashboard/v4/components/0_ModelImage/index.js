import React from "react";
import TypewriterText from "../TypewriterText";
import TextScramble from "@/foundations/pc/utils/TextScramble";
import * as S from "./styles";

const IMAGE_BASE = "/db/images/";

export default function ModelImage({ model }) {
  return (
    <S.Container>
      <S.ImageWrapper>
        <S.Image
          src={IMAGE_BASE + (model?.image || "g1.png")}
          alt={model?.name || "Model Image"}
          onError={(e) => {
            e.target.src = IMAGE_BASE + "g1.png";
          }}
        />
      </S.ImageWrapper>
      <S.Description>
        <TextScramble text={model?.explanation || ""} speed={2.5} />
      </S.Description>
    </S.Container>
  );
}
