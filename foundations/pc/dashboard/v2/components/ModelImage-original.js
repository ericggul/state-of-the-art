import React from "react";
import styled from "styled-components";
import TypewriterText from "./TypewriterText";
import { TIFFANY_BLUE } from "../utils/constants";

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1vw;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  border: 1px solid rgba(0, 170, 255, 0.2);
  margin-bottom: 1vw;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  filter: contrast(1.2) brightness(0.9);
`;

const NeonOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${TIFFANY_BLUE};
  background: rgba(129, 216, 208, 0.1);
  background: black;
  mix-blend-mode: screen;
  backdrop-filter: invert(1);
  pointer-events: none;
`;

const Description = styled.p`
  font-size: 0.9vw;
  line-height: 1.5;
  color: #ffffff;
`;

const IMAGE_BASE = "/db/images/";

export default function ModelImage({ model }) {
  return (
    <ImageContainer>
      <ImageWrapper>
        <Image
          src={IMAGE_BASE + model.image || IMAGE_BASE + "g1.png"}
          alt={model.name}
          onError={(e) => {
            e.target.src = IMAGE_BASE + "g1.png";
          }}
        />
        <NeonOverlay />
      </ImageWrapper>
      <Description>
        <TypewriterText text={model.explanation} speed={20} />
      </Description>
    </ImageContainer>
  );
}
