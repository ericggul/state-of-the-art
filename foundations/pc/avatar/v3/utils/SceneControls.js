"use client";
import { useControls, folder } from "leva";

const defaultValues = {
  Model: {
    position: [0, -2.5, 0],
    scale: 2,
    rotation: [0, 0, 0],
  },
  Lights: {
    ambientIntensity: 1,
    spotLight1: {
      intensity1: 0.4,
      color1: "#4facfe",
      angle1: 0.3,
      penumbra1: 1,
    },
    spotLight2: {
      intensity2: 0.4,
      color2: "#00f2fe",
      angle2: 0.3,
      penumbra2: 1,
    },
    frontLight: {
      intensityFront: 0.5,
      colorFront: "#ffffff",
      angleFront: 0.5,
    },
  },
  Stage: {
    floor: {
      floorColor: "#aaaaaa",
      floorMetalness: 0.9,
      floorRoughness: 0.1,
      floorOpacity: 0.8,
      floorReflectivity: 0.9,
      floorClearcoat: 1,
    },
    platform: {
      platformColor: "#000000",
      platformMetalness: 0.7,
      platformRoughness: 0.3,
    },
  },
};

export function useSceneControls() {
  const { Model: modelControls } = useControls({
    Model: folder({
      position: { value: defaultValues.Model.position },
      scale: { value: defaultValues.Model.scale, min: 0.1, max: 5, step: 0.1 },
      rotation: { value: defaultValues.Model.rotation },
    }),
  });

  const { Lights: lightControls } = useControls({
    Lights: folder({
      ambientIntensity: {
        value: defaultValues.Lights.ambientIntensity,
        min: 0,
        max: 2,
        step: 0.1,
      },
      spotLight1: folder({
        intensity1: {
          value: defaultValues.Lights.spotLight1.intensity1,
          min: 0,
          max: 1,
          step: 0.1,
        },
        color1: defaultValues.Lights.spotLight1.color1,
        angle1: {
          value: defaultValues.Lights.spotLight1.angle1,
          min: 0,
          max: Math.PI / 2,
          step: 0.1,
        },
        penumbra1: {
          value: defaultValues.Lights.spotLight1.penumbra1,
          min: 0,
          max: 1,
          step: 0.1,
        },
      }),
      spotLight2: folder({
        intensity2: {
          value: defaultValues.Lights.spotLight2.intensity2,
          min: 0,
          max: 1,
          step: 0.1,
        },
        color2: defaultValues.Lights.spotLight2.color2,
        angle2: {
          value: defaultValues.Lights.spotLight2.angle2,
          min: 0,
          max: Math.PI / 2,
          step: 0.1,
        },
        penumbra2: {
          value: defaultValues.Lights.spotLight2.penumbra2,
          min: 0,
          max: 1,
          step: 0.1,
        },
      }),
      frontLight: folder({
        intensityFront: {
          value: defaultValues.Lights.frontLight.intensityFront,
          min: 0,
          max: 1,
          step: 0.1,
        },
        colorFront: defaultValues.Lights.frontLight.colorFront,
        angleFront: {
          value: defaultValues.Lights.frontLight.angleFront,
          min: 0,
          max: Math.PI / 2,
          step: 0.1,
        },
      }),
    }),
  });

  const { Stage: stageControls } = useControls({
    Stage: folder({
      floor: folder({
        floorColor: defaultValues.Stage.floor.floorColor,
        floorMetalness: {
          value: defaultValues.Stage.floor.floorMetalness,
          min: 0,
          max: 1,
          step: 0.1,
        },
        floorRoughness: {
          value: defaultValues.Stage.floor.floorRoughness,
          min: 0,
          max: 1,
          step: 0.1,
        },
        floorOpacity: {
          value: defaultValues.Stage.floor.floorOpacity,
          min: 0,
          max: 1,
          step: 0.1,
        },
        floorReflectivity: {
          value: defaultValues.Stage.floor.floorReflectivity,
          min: 0,
          max: 1,
          step: 0.1,
        },
        floorClearcoat: {
          value: defaultValues.Stage.floor.floorClearcoat,
          min: 0,
          max: 1,
          step: 0.1,
        },
      }),
      platform: folder({
        platformColor: defaultValues.Stage.platform.platformColor,
        platformMetalness: {
          value: defaultValues.Stage.platform.platformMetalness,
          min: 0,
          max: 1,
          step: 0.1,
        },
        platformRoughness: {
          value: defaultValues.Stage.platform.platformRoughness,
          min: 0,
          max: 1,
          step: 0.1,
        },
      }),
    }),
  });

  return {
    modelControls,
    lightControls,
    stageControls,
  };
}
