import React, { useState } from "react";
import styled from "styled-components";
import { MODELS } from "./const";

export const getFlatModels = () => {
  const flatModels = [];

  const traverseModels = (obj, parentVersion) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (value.name && value.year) {
        flatModels.push({
          name: value.name,
          year: value.year,
          version: value.version || parentVersion,
          place: value.place,
          citation: value.citation,
          explanation: value.explanation,
        });
      }

      // Recursively traverse nested objects
      if (typeof value === "object") {
        traverseModels(value, key);
      }
    });
  };

  traverseModels(MODELS);
  return flatModels;
};

export default function ArchitectureSelector({
  socket,
  selectedModel,
  onModelSelect,
}) {
  const models = getFlatModels();

  return (
    <Container>
      <Title>Select Architecture</Title>
      <List>
        {models.map((model, index) => (
          <ListItem
            key={index}
            $active={selectedModel === model.name}
            onClick={() => onModelSelect(model)}
          >
            {model.name} ({model.year})
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

const Container = styled.div`
  margin: 20px 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
`;

const Title = styled.h3`
  color: white;
  margin-bottom: 10px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ListItem = styled.button`
  background: ${(props) => (props.$active ? "#333" : "#222")};
  color: white;
  border: none;
  padding: 8px 12px;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background: #444;
  }
`;
