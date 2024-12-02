import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  gap: 1vw;
  padding: 1.2vw;

  position: relative;
  width: calc(100% - 2.4vw);
  height: calc(100% - 2.4vw);
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 22vw;
  height: 100%;
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
  width: 12vw;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  line-height: 1.4;

  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-all;
  white-space: pre-wrap;
  hyphens: auto;

  max-height: 100%;
`;
