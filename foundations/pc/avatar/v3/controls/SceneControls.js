"use client";
import { useControls } from "leva";

export function useSceneControls() {
  const modelControls = useControls("Model Adjustment", {
    position: {
      value: [0, -2, 0],
      step: 0.1,
      label: "Position [x,y,z]",
    },
    scale: {
      value: 2,
      min: 0.1,
      max: 3,
      step: 0.1,
      label: "Size",
    },
  });

  return modelControls;
}
