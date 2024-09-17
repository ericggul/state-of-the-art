import React, { forwardRef } from "react";
import { Instance } from "@react-three/drei";

const Node = forwardRef(({ position, size, color, opacity = 0.4, scale }, ref) => {
  return <Instance ref={ref} position={position} scale={size} color={color} />;
});

export default Node;
