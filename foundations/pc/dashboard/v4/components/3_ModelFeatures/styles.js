import styled, { keyframes } from "styled-components";

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const pulseGlow = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 0.5; }
  100% { opacity: 0.3; }
`;

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2),
    inset 0 0 15px rgba(255, 255, 255, 0.05);
`;

export const Section = styled.div`
  position: relative;
  height: 100%;
  background: linear-gradient(
    135deg,
    hsla(${(props) => props.$hue}, 15%, 10%, 0.3) 0%,
    hsla(${(props) => props.$hue}, 20%, 5%, 0.3) 100%
  );
  clip-path: polygon(
    0 0,
    calc(100% - 1vw) 0,
    100% 1vw,
    100% 100%,
    1vw 100%,
    0 calc(100% - 1vw)
  );
  border: 1px solid hsla(${(props) => props.$hue}, 100%, 75%, 0.2);
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      hsla(${(props) => props.$hue}, 100%, 75%, 0.5),
      transparent
    );
    animation: ${scanline} 1s linear infinite;
    opacity: 0.5;
  }
`;

export const Title = styled.h4`
  font-size: 1.2vw;
  margin: 0;
  padding: 0.8vw;
  color: hsla(${(props) => props.$hue}, 15%, 95%, 0.9);
  text-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 80%, 50%, 0.2);
  background: linear-gradient(
    90deg,
    hsla(${(props) => props.$hue}, 15%, 10%, 0.5),
    hsla(${(props) => props.$hue}, 20%, 5%, 0.5)
  );
  border-bottom: 1px solid hsla(${(props) => props.$hue}, 100%, 75%, 0.2);
`;

export const List = styled.ul`
  list-style: none;
  padding: 0.8vw 0;
  margin: 0;
  height: calc(100% - 3.6vw);
  overflow-y: hidden;
`;

export const Item = styled.li`
  display: flex;
  align-items: baseline;
  gap: 0.2vw;
  margin-bottom: 0.2vw;
  padding: 0.5vw;
  font-size: 0.7vw;
  color: hsla(${(props) => props.$hue}, 15%, 98%, 0.7);
  background: linear-gradient(
    135deg,
    hsla(${(props) => props.$hue}, 15%, 10%, 0.3) 0%,
    hsla(${(props) => props.$hue}, 20%, 5%, 0.3) 100%
  );
  border-left: 2px solid hsla(${(props) => props.$hue}, 100%, 75%, 0.3);
  box-shadow: 0 0 1vw hsla(${(props) => props.$hue}, 100%, 75%, 0.1);
  transition: all 0.3s ease-in-out;
  position: relative;
  overflow: hidden;

  &:hover {
    background: linear-gradient(
      135deg,
      hsla(${(props) => props.$hue}, 15%, 15%, 0.4) 0%,
      hsla(${(props) => props.$hue}, 20%, 10%, 0.4) 100%
    );
    border-left: 2px solid hsla(${(props) => props.$hue}, 100%, 75%, 0.5);
    box-shadow: 0 0 1.5vw hsla(${(props) => props.$hue}, 100%, 75%, 0.2);
  }
`;

export const Bullet = styled.span`
  color: ${(props) =>
    props.$isHighlight
      ? `hsla(${props.$hue}, 100%, 75%, 0.8)`
      : `hsla(${props.$hue - 180}, 100%, 75%, 0.8)`};
  font-weight: bold;
  text-shadow: 0 0 0.8vw
    ${(props) =>
      props.$isHighlight
        ? `hsla(${props.$hue}, 100%, 50%, 0.4)`
        : `hsla(${props.$hue - 180}, 100%, 50%, 0.4)`};
  padding: 0 0.4vw;
`;

export const TextWrapper = styled.div`
  white-space: normal;
  word-wrap: break-word;
  word-break: break-word;
  line-height: 1.4;
  flex: 1;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
`;
