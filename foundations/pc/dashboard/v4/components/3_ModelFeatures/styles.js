import styled from "styled-components";

export const Container = styled.div`
  display: grid;

  position: relative;
  width: calc(100% - 2.4vw);
  height: calc(100% - 2.4vw);

  padding: 1.2vw;
`;

export const Section = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  clip-path: polygon(
    0 0,
    calc(100% - 1vw) 0,
    100% 1vw,
    100% 100%,
    1vw 100%,
    0 calc(100% - 1vw)
  );
`;

export const Title = styled.h4`
  font-size: 1.2vw;
  margin: 0 0 1.5vw 0;
  color: rgba(255, 255, 255, 0.9);
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const Item = styled.li`
  display: flex;
  align-items: baseline;
  gap: 0.5vw;
  margin-bottom: 1vw;
  font-size: 0.9vw;
  color: rgba(255, 255, 255, 0.7);
`;

export const Bullet = styled.span`
  color: ${(props) =>
    props.$isHighlight ? "rgba(0, 255, 0, 0.8)" : "rgba(255, 0, 0, 0.8)"};
  font-weight: bold;
`;

export const TextWrapper = styled.div`
  white-space: normal;
  word-wrap: break-word;
  word-break: break-word;
  line-height: 1.4;
  flex: 1;
`;
