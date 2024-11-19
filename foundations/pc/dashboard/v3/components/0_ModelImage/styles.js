import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1vw;
  padding: 1.2vw;

  position: relative;
  width: calc(100% - 2.4vw);
  height: calc(100% - 2.4vw);
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 17vh;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);

  transition: all 0.3s ease;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(0.9) contrast(1.1);
  transition: all 0.3s ease;
`;

export const Description = styled.div`
  font-size: 0.7vw;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
`;
