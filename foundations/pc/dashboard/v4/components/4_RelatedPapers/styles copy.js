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
  color: hsla(${(props) => props.$hue}, 15%, 95%, 0.9);
  text-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 80%, 50%, 0.2);
`;

export const PaperList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const PaperItem = styled.li`
  font-size: 0.7vw;
  color: hsla(${(props) => props.$hue}, 15%, 98%, 0.7);
  margin-bottom: 0.5vw;
  padding: 0.5vw 0.8vw;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  white-space: normal;
  word-wrap: break-word;
  word-break: break-word;
  line-height: 1.4;

  background: linear-gradient(
    135deg,
    hsla(${(props) => props.$hue}, 15%, 10%, 0.3) 0%,
    hsla(${(props) => props.$hue}, 20%, 5%, 0.3) 100%
  );
  border-left: 2px solid hsla(${(props) => props.$hue}, 100%, 75%, 0.3);
  box-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 100%, 75%, 0.1);
  transition: all 0.3s ease-in-out;

  &:hover {
    background: linear-gradient(
      135deg,
      hsla(${(props) => props.$hue}, 15%, 12%, 0.4) 0%,
      hsla(${(props) => props.$hue}, 20%, 7%, 0.4) 100%
    );
    border-left-color: hsla(${(props) => props.$hue}, 100%, 75%, 0.4);
  }
`;
