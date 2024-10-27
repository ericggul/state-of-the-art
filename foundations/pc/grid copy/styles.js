import styled from "styled-components";
import { FlexCenterStyle, WholeContainer } from "@/styles";

export const Container = styled.div`
  ${WholeContainer}

  width: 100%;
  height: 100%;
  background-color: #000;
  color: #0f0;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
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
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 5px;
  flex: 1;
`;

export const GridItem = styled.div`
  background-color: ${(props) => (props.$isHighlighted ? "#0f03" : "#0f01")};
  border: 1px solid #0f0;
  padding: 5px;
  border-radius: 3px;
  transition: all 0.3s ease;
  font-size: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &:hover {
    background-color: #0f02;
  }
`;

export const ModelName = styled.div`
  font-weight: bold;
  margin-bottom: 2px;
`;

export const ModelVersion = styled.div`
  opacity: 0.7;
`;
