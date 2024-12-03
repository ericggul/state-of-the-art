import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  position: relative;
  width: calc(100% - 2.4vw);
  height: calc(100% - 2.4vw);

  padding: 1.2vw;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5vw;
`;

export const Title = styled.h4`
  font-size: 1vw;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
`;

export const PaperList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const PaperItem = styled.li`
  font-size: 0.7vw;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5vw;
  padding: 0.5vw 0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  white-space: normal;
  word-wrap: break-word;
  word-break: break-word;
  line-height: 1.4;
`;
