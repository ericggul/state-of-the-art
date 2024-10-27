import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const Container = styled.div`
  ${WholeContainer}
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background: linear-gradient(to bottom right, #1a1a2e, #16213e);
  color: #e94560;
`;

export const Header = styled.header`
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

export const Subtitle = styled.h2`
  font-size: 1.2rem;
  color: #0f3460;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const CardTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #0f3460;
`;

export const ModelImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 5px;
  margin-bottom: 1rem;
`;

export const Description = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
`;

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;

export const Stat = styled.div`
  text-align: center;
`;

export const StatLabel = styled.p`
  font-size: 0.8rem;
  color: #0f3460;
`;

export const StatValue = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
`;
