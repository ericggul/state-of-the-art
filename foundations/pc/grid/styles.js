import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const Container = styled.div`
  ${WholeContainer}
  width: 100vw;
  height: 100vh;
  background-color: #000;
  color: #0f0;
  padding: 5vh;
  box-sizing: border-box;
  overflow: hidden;
`;

export const GroupContainer = styled.div`
  margin-bottom: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const GroupTitle = styled.h2`
  font-size: 14px;
  margin-bottom: 5px;
  border-bottom: 1px solid #0f0;
  padding-bottom: 2px;
`;

export const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10.4vw, 1fr));
  gap: 0.5vw;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const GridItem = styled.div`
  background-color: ${(props) => (props.$isHighlighted ? "#0f03" : "#0f01")};
  border: 0.05vw solid #0f0;
  padding: 0.5vw;
  border-radius: 0.25vw;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &:hover {
    background-color: #0f02;
  }
`;

export const ModelName = styled.div`
  font-size: 0.73vw;
  font-weight: bold;
  margin-bottom: 0.26vw;
`;

export const ModelVersion = styled.div`
  font-size: 0.63vw;
  opacity: 0.7;
`;
