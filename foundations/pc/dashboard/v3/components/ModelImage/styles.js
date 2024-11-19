import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5vw;
  padding: 1.5vw;
  width: 100%;
  height: 100%;
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 20vh;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  clip-path: polygon(
    0 0,
    calc(100% - 1vw) 0,
    100% 1vw,
    100% 100%,
    1vw 100%,
    0 calc(100% - 1vw)
  );
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(0.9) contrast(1.1);
`;

export const Description = styled.div`
  font-size: 0.9vw;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
`;
