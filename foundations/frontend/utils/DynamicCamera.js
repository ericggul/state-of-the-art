import React, { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const LERP_FACTOR = 0.02;
// const ANIMATION_SPEED = {
//   ROTATION: 0.15, // Very slow base rotation
//   POLAR: 0.37, // Increased for more noticeable up/down
//   ZOOM: 0.23, // Faster zoom speed
// };

const ANIMATION_SPEED = {
  ROTATION: 0.15, // Very slow base rotation
  POLAR: 0.3, // Increased for more noticeable up/down
  ZOOM: 0.3, // Faster zoom speed
};

const HEIGHT_MULTIPLIER = 0.5;
const ZOOM_RANGE = {
  MIN: 0.01,
  MAX: 1.0,
};

export function DynamicCamera({ cameraDistance }) {
  const { camera } = useThree();
  const timeRef = useRef(0);
  const currentPosition = useRef(new THREE.Vector3());
  const targetPosition = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    timeRef.current += delta;

    // Simple circular motion with more pronounced up/down
    const angle = timeRef.current * ANIMATION_SPEED.ROTATION;
    const heightOffset =
      Math.sin(timeRef.current * ANIMATION_SPEED.POLAR) *
      HEIGHT_MULTIPLIER *
      cameraDistance;

    // Faster zoom effect
    const zoomProgress =
      (Math.sin(timeRef.current * ANIMATION_SPEED.ZOOM) + 1) / 2;
    const zoomOffset =
      ZOOM_RANGE.MIN + zoomProgress * (ZOOM_RANGE.MAX - ZOOM_RANGE.MIN);

    // Calculate target position with zoom
    const distance = cameraDistance * zoomOffset;
    targetPosition.current.set(
      Math.sin(angle) * distance,
      heightOffset, // Direct height offset without additional multiplication
      Math.cos(angle) * distance
    );

    // Smooth camera movement
    camera.position.lerp(targetPosition.current, LERP_FACTOR);
    camera.lookAt(0, 0, 0);
  });

  useEffect(() => {
    return () => {
      camera.position.set(0, 0, cameraDistance);
      camera.lookAt(0, 0, 0);
    };
  }, [camera, cameraDistance]);

  return null;
}
