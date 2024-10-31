import React from "react";
import styled from "styled-components";

import TypewriterText from "./TypewriterText";
import { RELATED_PAPERS } from "./constants";

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
      {RELATED_PAPERS.map((paper, index) => (
        <PaperItem key={index}>
          <PaperLink>
            <TypewriterText text={paper.title} speed={20} /> -{" "}
            <TypewriterText text={paper.authors} speed={20} /> - {paper.year}
          </PaperLink>
        </PaperItem>
      ))}
    </PaperList>
  );
}
