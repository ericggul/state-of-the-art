"use client";
import { useControls, folder } from "leva";

export function useSceneControls() {
  const modelControls = useControls("Model", {
    position: { value: [0, -2.5, 0], step: 0.1 },
    scale: { value: 2, min: 0.1, max: 5, step: 0.1 },
    rotation: { value: [0, 0, 0], step: 0.1 },
    materialColor: "#ffffff",
    metalness: { value: 0.5, min: 0, max: 1, step: 0.1 },
    roughness: { value: 0.5, min: 0, max: 1, step: 0.1 },
  });

  const lightControls = useControls("Lights", {
    ambientIntensity: { value: 0.3, min: 0, max: 3, step: 0.1 },
    spotLight1: folder({
      intensity1: { value: 0.8, min: 0, max: 3, step: 0.1 },
      color1: "#4facfe",
      angle1: { value: 0.5, min: 0, max: Math.PI / 2, step: 0.1 },
      penumbra1: { value: 0.5, min: 0, max: 1, step: 0.1 },
    }),
    spotLight2: folder({
      intensity2: { value: 0.8, min: 0, max: 3, step: 0.1 },
      color2: "#00f2fe",
      angle2: { value: 0.5, min: 0, max: Math.PI / 2, step: 0.1 },
      penumbra2: { value: 0.5, min: 0, max: 1, step: 0.1 },
    }),
    frontLight: folder({
      intensityFront: { value: 0.6, min: 0, max: 3, step: 0.1 },
      colorFront: "#ffffff",
      angleFront: { value: 0.6, min: 0, max: Math.PI / 2, step: 0.1 },
      penumbraFront: { value: 0.5, min: 0, max: 1, step: 0.1 },
    }),
  });

  const stageControls = useControls("Stage", {
    floor: folder({
      floorColor: "#303030",
      floorMetalness: { value: 0.2, min: 0, max: 1, step: 0.1 },
      floorRoughness: { value: 0.8, min: 0, max: 1, step: 0.1 },
      floorOpacity: { value: 1, min: 0, max: 1, step: 0.1 },
      floorReflectivity: { value: 0.5, min: 0, max: 1, step: 0.1 },
      floorClearcoat: { value: 0.1, min: 0, max: 1, step: 0.1 },
    }),
    platform: folder({
      platformColor: "#1a1a1a",
      platformMetalness: { value: 0.5, min: 0, max: 1, step: 0.1 },
      platformRoughness: { value: 0.5, min: 0, max: 1, step: 0.1 },
    }),
  });

  console.log({
    lightControls,
    stageControls,
    modelControls,
  });

  return {
    modelControls,
    lightControls,
    stageControls,
  };
}
