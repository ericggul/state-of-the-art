import React from "react";
import styled from "styled-components";

const PaperList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const PaperItem = styled.li`
  margin-bottom: 10px;
`;

const PaperLink = styled.a`
  color: #e94560;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
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
