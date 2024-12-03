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
  color: hsla(${(props) => props.$hue}, 15%, 95%, 0.9);
  text-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 80%, 50%, 0.2);
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
  margin-bottom: 0.5vw;
  font-size: 0.8vw;
  color: hsla(${(props) => props.$hue}, 15%, 98%, 0.7);
`;

export const Bullet = styled.span`
  color: ${
    (props) =>
      props.$isHighlight
        ? `hsla(${props.$hue}, 100%, 75%, 0.8)` // Positive highlight color
        : `hsla(${props.$hue - 180}, 100%, 75%, 0.8)` // Negative highlight color (opposite hue)
  };
  font-weight: bold;
  text-shadow: 0 0 0.8vw
    ${(props) =>
      props.$isHighlight
        ? `hsla(${props.$hue}, 100%, 50%, 0.4)`
        : `hsla(${props.$hue - 180}, 100%, 50%, 0.4)`};
`;

export const TextWrapper = styled.div`
  white-space: normal;
  word-wrap: break-word;
  word-break: break-word;
  line-height: 1.4;
  flex: 1;
`;
