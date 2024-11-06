import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { LAYER_CONFIGS } from "../arch-models/_structure";
import BasicNNLayers from "../arch/layers/BasicNNLayers";
import CNNLayers from "../arch/layers/CNNLayers";
import TransformerLayers from "../arch/layers/TransformerLayers";
import RNNLayers from "../arch/layers/RNNLayers";
import VAELayers from "../arch/layers/VAELayers";
import SelfSupervisedLayers from "../arch/layers/SelfSupervisedLayers";
import GANLayers from "../arch/layers/GANLayers";
import DiffusionLayers from "../arch/layers/DiffusionLayers";
import MultiModalLayers from "../arch/layers/MultiModalLayers";
import ReinforcementLayers from "../arch/layers/ReinforcementLayers";
import HopfieldLayers from "../arch/layers/HopfieldLayers";
import BoltzmannLayers from "../arch/layers/BoltzmannLayers";

const ROTATION_SPEED = 0.0005;
const SCALE_ANIMATION_SPEED = 0.05;

export default function ModelContainer({
  modelName,
  structure,
  style,
  modelGroupRef,
  onModelChange,
}) {
  const rotationRef = useRef(0);
  const [targetScale, setTargetScale] = useState(1);
  const currentScale = useRef(1);

  // This holds the currently displayed model name and structure
  const [currentModelName, setCurrentModelName] = useState(modelName);
  const [currentStructure, setCurrentStructure] = useState(structure);

  useEffect(() => {
    if (currentModelName !== modelName) {
      // Start scaling down
      setTargetScale(0);
    }
  }, [modelName, currentModelName]);

  useFrame(() => {
    if (!modelGroupRef.current) return;

    // Continuous rotation
    rotationRef.current += ROTATION_SPEED;
    modelGroupRef.current.rotation.y = rotationRef.current;

    // Smooth scale animation
    const scaleDiff = targetScale - currentScale.current;
    if (Math.abs(scaleDiff) > 0.001) {
      currentScale.current += scaleDiff * SCALE_ANIMATION_SPEED;
      modelGroupRef.current.scale.setScalar(currentScale.current);

      // Check if scaling down is complete
      if (currentScale.current <= 0.01 && targetScale === 0) {
        // Update the model
        setCurrentModelName(modelName);
        setCurrentStructure(structure);

        // Notify parent that the model has changed
        if (onModelChange) {
          onModelChange();
        }

        // Start scaling up
        setTargetScale(1);
      }
    }
  });

  // Model component selection logic
  const modelConfig = LAYER_CONFIGS[currentModelName];
  let ModelComponent = BasicNNLayers; // Default component

  if (modelConfig) {
    switch (modelConfig.type) {
      case "basic_nn":
        ModelComponent = BasicNNLayers;
        break;
      case "cnn":
        ModelComponent = CNNLayers;
        break;
      case "transformer":
        ModelComponent = TransformerLayers;
        break;
      case "rnn":
        ModelComponent = RNNLayers;
        break;
      case "vae":
        ModelComponent = VAELayers;
        break;
      case "self_supervised":
        ModelComponent = SelfSupervisedLayers;
        break;
      case "gan":
        ModelComponent = GANLayers;
        break;
      case "diffusion":
        ModelComponent = DiffusionLayers;
        break;
      case "multi_modal":
        ModelComponent = MultiModalLayers;
        break;
      case "reinforcement":
        ModelComponent = ReinforcementLayers;
        break;
      case "hopfield":
        ModelComponent = HopfieldLayers;
        break;
      case "boltzmann":
        ModelComponent = BoltzmannLayers;
        break;
      default:
        console.warn(
          `Unknown model type: ${modelConfig.type}. Defaulting to BasicNNLayers.`
        );
        ModelComponent = BasicNNLayers;
    }
  } else {
    console.warn(
      `No configuration found for model: ${currentModelName}. Defaulting to BasicNNLayers.`
    );
    ModelComponent = BasicNNLayers;
  }

  return (
    <group ref={modelGroupRef}>
      {currentStructure.length > 0 && (
        <ModelComponent
          structure={currentStructure}
          style={style}
          model={currentModelName}
        />
      )}
    </group>
  );
}
