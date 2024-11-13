import React from "react";
import styled from "styled-components";
import TypewriterText from "./TypewriterText";

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1vw;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  border: 1px solid rgba(0, 255, 255, 0.2);
  margin-bottom: 1vw;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
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
      </ImageWrapper>
      <Description>
        <TypewriterText text={model.explanation} speed={20} />
      </Description>
    </ImageContainer>
  );
}
