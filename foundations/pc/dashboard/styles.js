import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const Container = styled.div`
  ${WholeContainer}
  display: flex;
  flex-direction: column;
  padding: 2vw;
  background: #000000;
  color: #00ffff;
  font-family: ${(props) =>
      props.$isTransition ? "Comic Sans MS" : "Orbitron"},
    sans-serif;
`;

export const Header = styled.header`
  margin-bottom: 2vw;
`;

export const Title = styled.h1`
  font-size: 2.5vw;
  margin-bottom: 0.5vw;
  color: #00ffff;
  text-shadow: 0 0 10px #00ffff;
`;

export const Subtitle = styled.h2`
  font-size: 1.2vw;
  color: #0080ff;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(25vw, 1fr));
  gap: 2vw;
`;

export const Card = styled.div`
  background: rgba(0, 128, 255, 0.1);
  border-radius: 10px;
  padding: 1.5vw;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
  border: 1px solid rgba(0, 255, 255, 0.1);
`;

export const CardTitle = styled.h3`
  font-size: 1.2vw;
  margin-bottom: 1vw;
  color: #00ffff;
  text-shadow: 0 0 5px #00ffff;
`;

export const ModelImageWrapper = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  border: 1px solid rgba(0, 255, 255, 0.2);
  margin-bottom: 1vw;
`;

export const ModelImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const Description = styled.p`
  font-size: 0.9vw;
  line-height: 1.5;
  color: #ffffff;
`;

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1vw;
`;

export const Stat = styled.div`
  text-align: center;
`;

export const StatLabel = styled.p`
  font-size: 0.8vw;
  color: #0080ff;
`;

export const StatValue = styled.p`
  font-size: 1.2vw;
  font-weight: bold;
  color: #00ffff;
`;
