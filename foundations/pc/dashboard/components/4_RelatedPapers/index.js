import React from "react";
import TypewriterText from "../TypewriterText";
import TextScramble from "@/foundations/pc/utils/TextScramble";
import { DEFAULT_MODEL } from "../../utils/constants";
import { CitationParser } from "../../utils/citationParser";
import * as S from "./styles";

export default function RelatedPapers({ model, hue }) {
  const currentModel = model || DEFAULT_MODEL;
  const mainPaper = currentModel.paper;
  const relatedPapers = currentModel.relatedPapers || [];

  return (
    <S.Container>
      <S.Section>
        <S.Title $hue={hue}>Original Paper</S.Title>
        <S.PaperList>
          <S.PaperItem $hue={hue}>
            <TextScramble text={mainPaper} speed={2} />
          </S.PaperItem>
        </S.PaperList>
      </S.Section>

      <S.Section>
        <S.Title $hue={hue}>Related</S.Title>
        <S.PaperList>
          {relatedPapers.map((citation, index) => (
            <S.PaperItem key={index} $hue={hue}>
              <TextScramble text={citation} speed={2} />
            </S.PaperItem>
          ))}
        </S.PaperList>
      </S.Section>
    </S.Container>
  );
}
