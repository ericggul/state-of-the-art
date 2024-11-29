import React, { useRef, useEffect, memo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const LERP_FACTOR = 0.02;
const DISTANCE_LERP_FACTOR = 0.05;

const ANIMATION_SPEED = {
  ROTATION: 0.15, // Very slow base rotation
  POLAR: 0.3, // Increased for more noticeable up/down
  ZOOM: 0.3, // Faster zoom speed
};

const HEIGHT_MULTIPLIER = 0.5;
const ZOOM_RANGE = {
  MIN: 0.01,
  MAX: 1.3,
};

export const DynamicCamera = memo(
  function DynamicCamera({ cameraDistance }) {
    const { camera } = useThree();
    const timeRef = useRef(0);
    const currentPosition = useRef(new THREE.Vector3());
    const targetPosition = useRef(new THREE.Vector3());
    const currentDistanceRef = useRef(cameraDistance);
    const angleRef = useRef(0);

    useFrame((state, delta) => {
      // Increment independent time
      timeRef.current += delta;

      // Smoothly interpolate distance
      currentDistanceRef.current +=
        (cameraDistance - currentDistanceRef.current) * DISTANCE_LERP_FACTOR;

      // Update angle independently
      angleRef.current += ANIMATION_SPEED.ROTATION * delta;

      // Calculate motion parameters
      const heightOffset =
        Math.sin(timeRef.current * ANIMATION_SPEED.POLAR) *
        HEIGHT_MULTIPLIER *
        currentDistanceRef.current;

      const zoomProgress =
        (Math.sin(timeRef.current * ANIMATION_SPEED.ZOOM) + 1) / 2;
      const zoomOffset =
        ZOOM_RANGE.MIN + zoomProgress * (ZOOM_RANGE.MAX - ZOOM_RANGE.MIN);

      // Calculate target position with current interpolated distance
      const distance = currentDistanceRef.current * zoomOffset;
      targetPosition.current.set(
        Math.sin(angleRef.current) * distance,
        heightOffset,
        Math.cos(angleRef.current) * distance
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
  },
  (prevProps, nextProps) => {
    // Only re-render if cameraDistance changes significantly
    return Math.abs(prevProps.cameraDistance - nextProps.cameraDistance) < 0.1;
  }
);

DynamicCamera.displayName = "DynamicCamera";
