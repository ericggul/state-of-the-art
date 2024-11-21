import React, { useState } from "react";
import styled from "styled-components";
import { MODELS } from "@/components/controller/constant/models/v3";

// Convert nested MODELS object to flat array for easier selection
const getFlatModels = () => {
  const flatModels = [];
  Object.values(MODELS).forEach((versionGroup) => {
    Object.values(versionGroup).forEach((model) => {
      if (model.name && model.year) {
        flatModels.push({
          name: model.name,
          version: model.version || Object.keys(versionGroup)[0],
          year: model.year,
        });
      }
    });
  });
  return flatModels;
};

export default function ArchitectureSelector({ socket }) {
  const [selectedModel, setSelectedModel] = useState("Hopfield Network");
  const models = getFlatModels();

  const handleModelSelect = (model) => {
    setSelectedModel(model.name);
    if (socket.current) {
      socket.current.emit("gartience-new-architectures", [model]);
    }
  };

  return (
    <Container>
      <Title>Select Architecture</Title>
      <List>
        {models.map((model, index) => (
          <ListItem
            key={index}
            $active={selectedModel === model.name}
            onClick={() => handleModelSelect(model)}
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
  max-height: 300px;
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
