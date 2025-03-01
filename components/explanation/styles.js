import { WholeContainer } from "@/styles";
import styled from "styled-components";

export const Wrapper = styled.div`
  ${WholeContainer}
  background: rgba(0, 0, 0, 0.95);
  color: #fff;
  font-family: "Inter", sans-serif;
  position: relative;
  overflow-y: auto;
  cursor: default !important;
  -webkit-overflow-scrolling: touch;
`;

export const MainContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 7vw;
    max-width: calc(100% - 14vw);
  }
`;

export const Header = styled.div`
  width: 100%;
  text-align: left;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    max-width: 100%;
    margin: 0 auto 3rem;
  }
`;

export const Title = styled.h1`
  font-size: clamp(1.5rem, 5vw, 2rem);
  font-weight: 300;
  margin: 0;
  color: white;
`;

export const Subtitle = styled.h2`
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 2rem;
`;

export const VideoContainer = styled.div`
  width: 100%;
  margin: 2rem 0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  background: rgba(255, 255, 255, 0.05);

  @media (max-width: 768px) {
    margin: 1.5rem 0;
  }
`;

export const VideoWrapper = styled.div`
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  position: relative;
`;

export const InfoSection = styled.div`
  margin: 1.5rem 0;
`;

export const InfoText = styled.h3`
  font-size: clamp(0.9rem, 3vw, 1rem);
  color: rgba(255, 255, 255, 0.8);
  margin: 0.4rem 0;
  font-weight: 300;
  line-height: 1.4;
`;

export const ExhibitionInfo = styled(InfoText)`
  margin-top: 1.2rem;
  font-size: clamp(0.85rem, 2.8vw, 0.95rem);
  color: rgba(255, 255, 255, 0.75);
  font-style: italic;
`;

export const TechStack = styled(InfoText)`
  color: rgba(255, 255, 255, 0.6);
  font-size: clamp(0.8rem, 2.5vw, 0.9rem);
  margin-top: 0.8rem;
`;

export const CreditsSection = styled.div`
  margin: 2rem 0;
  text-align: left;
`;

export const Institution = styled(InfoText)`
  color: white;
  font-weight: 400;
  margin-bottom: 0.2rem;
  line-height: 1.6;
`;

export const InstitutionDepartment = styled(InfoText)`
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  margin-bottom: 1rem;
  font-size: clamp(0.8rem, 2.5vw, 0.9rem);
`;

export const Credit = styled(InfoText)`
  font-size: clamp(0.7rem, 2.5vw, 0.8rem);
  margin: 0.2rem 0;
  text-align: left;

  strong {
    font-weight: 500;
    color: white;
  }
`;

export const Spacer = styled.div`
  height: 0.8rem;
`;

export const LabLink = styled.a`
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: clamp(0.7rem, 2.5vw, 0.8rem);
  margin: 1rem 0;
  transition: color 0.3s ease;
  display: inline-block;

  &:hover {
    color: white;
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 3rem;
    max-width: 100%;
    margin: 0 auto;
  }
`;

export const TextColumn = styled.div`
  flex: 1;
  min-width: 0;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const TextWrapper = styled.div`
  font-size: clamp(0.9rem, 3vw, 1rem);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  word-break: keep-all;
`;

export const ImageContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin: 2rem 0 3rem;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    margin: 1.5rem 0 2.5rem;
  }
`;

export const ImageWrapper = styled.div`
  flex: 1;
  aspect-ratio: 16/9;
  overflow: hidden;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
`;

export const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;
