import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const Container = styled.div`
  ${WholeContainer}
  display: flex;
  flex-direction: column;
  padding: 2vw;
  background: #000000;
  color: #00ffff;
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
