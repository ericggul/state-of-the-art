import React from "react";
import styled from "styled-components";

const PaperList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const PaperItem = styled.li`
  margin-bottom: 1vw;
`;

const PaperLink = styled.a`
  color: #00ffff;
  text-decoration: none;
  font-size: 0.9vw;
  &:hover {
    text-decoration: underline;
    text-shadow: 0 0 5px #00ffff;
  }
`;

export default function RelatedPapers({ papers }) {
  return (
    <PaperList>
      {papers.map((paper, index) => (
        <PaperItem key={index}>
          <PaperLink href={paper.url} target="_blank" rel="noopener noreferrer">
            {paper.title} - {paper.authors} ({paper.year})
          </PaperLink>
        </PaperItem>
      ))}
    </PaperList>
  );
}
