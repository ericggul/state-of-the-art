import React from "react";
import TypewriterText from "../TypewriterText";
import { DEFAULT_MODEL } from "../../utils/constants";
import { CitationParser } from "../../utils/citationParser";
import * as S from "./styles";

export default function RelatedPapers({ model }) {
  const currentModel = model || DEFAULT_MODEL;
  const mainPaper = currentModel.paper;
  const relatedPapers = currentModel.relatedPapers || [];

  return (
    <S.Container>
      <S.Section>
        <S.Title>Original Paper</S.Title>
        <S.PaperList>
          <S.PaperItem>
            <TypewriterText
              text={CitationParser.formatForDisplay(
                CitationParser.parseAPA(mainPaper)
              )}
              speed={20}
            />
          </S.PaperItem>
        </S.PaperList>
      </S.Section>

      <S.Section>
        <S.Title>Related Research</S.Title>
        <S.PaperList>
          {relatedPapers.map((citation, index) => (
            <S.PaperItem key={index}>
              <TypewriterText
                text={CitationParser.formatForDisplay(
                  CitationParser.parseAPA(citation)
                )}
                speed={20}
              />
            </S.PaperItem>
          ))}
        </S.PaperList>
      </S.Section>
    </S.Container>
  );
}
