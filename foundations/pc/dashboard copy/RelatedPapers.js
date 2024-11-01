import React from "react";
import styled from "styled-components";
import TypewriterText from "./TypewriterText";
import { RELATED_PAPERS } from "./constants";
import { CitationParser } from "./utils/citationParser";

const PaperList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const PaperItem = styled.li`
  margin-bottom: 1vw;
`;

const PaperLink = styled.div`
  color: #00ffff;
  text-decoration: none;
  font-size: 0.9vw;
`;

export default function RelatedPapers() {
  return (
    <PaperList>
      {RELATED_PAPERS.map((citation, index) => {
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
    </PaperList>
  );
}
