import React from "react";
import styled from "styled-components";
import TypewriterText from "./TypewriterText";
import { DEFAULT_MODEL } from "./constants";
import { CitationParser } from "./utils/citationParser";

const PaperList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const PaperSection = styled.div`
  margin-bottom: 2vw;
`;

const SectionTitle = styled.h4`
  color: #00ffff;
  font-size: 0.9vw;
  margin-bottom: 1vw;
  text-shadow: 0 0 10px #00ffff;
  opacity: 0.8;
`;

const PaperItem = styled.li`
  margin-bottom: 1vw;
`;

const PaperLink = styled.div`
  color: #00ffff;
  text-decoration: none;
  font-size: 0.9vw;
`;

export default function RelatedPapers({ model }) {
  const currentModel = model || DEFAULT_MODEL;
  const mainPaper = currentModel.paper;
  const relatedPapers = currentModel.relatedPapers || [];

  return (
    <PaperList>
      <PaperSection>
        <SectionTitle>Original Paper</SectionTitle>
        <PaperItem>
          <PaperLink>
            <TypewriterText
              text={CitationParser.formatForDisplay(
                CitationParser.parseAPA(mainPaper)
              )}
              speed={20}
            />
          </PaperLink>
        </PaperItem>
      </PaperSection>

      <PaperSection>
        <SectionTitle>Related Research</SectionTitle>
        {relatedPapers.map((citation, index) => {
          const parsed = CitationParser.parseAPA(citation);
          const displayText = CitationParser.formatForDisplay(parsed);

          return (
            <PaperItem key={index}>
              <PaperLink>
                <TypewriterText text={displayText} speed={20} />
              </PaperLink>
            </PaperItem>
          );
        })}
      </PaperSection>
    </PaperList>
  );
}
