import React, { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useSocketScreenOrientation from "@/utils/socket/orientation/useSocketScreen";

const LERP_FACTOR = 0.05; // Reduced for smoother movement
const MIN_POLAR_ANGLE = Math.PI / 4;
const MAX_POLAR_ANGLE = Math.PI / 2;

export function AvatarOrientationCamera({ cameraDistance = 3 }) {
  const { camera } = useThree();

  const sensorDataRef = useRef({
    orientation: { alpha: 0, beta: 0, gamma: 0 },
  });

  const eulerRef = useRef(new THREE.Euler());
  const quaternionRef = useRef(new THREE.Quaternion());
  const targetPositionRef = useRef(new THREE.Vector3());
  const currentQuaternionRef = useRef(new THREE.Quaternion());

  const handleNewMobileOrientation = (data) => {
    sensorDataRef.current = data;
  };

  useSocketScreenOrientation({
    handleNewMobileOrientation,
  });

  useFrame(() => {
    const { orientation } = sensorDataRef.current;
    let { alpha, beta, gamma } = orientation;

    // Match the rotation direction
    alpha = -alpha;
    beta = -beta;
    gamma = -gamma;

    // Convert degrees to radians
    const alphaRad = THREE.MathUtils.degToRad(alpha);
    const betaRad = THREE.MathUtils.degToRad(beta);
    const gammaRad = THREE.MathUtils.degToRad(gamma);

    // Apply polar angle constraints
    const constrainedBeta = THREE.MathUtils.clamp(
      betaRad,
      MIN_POLAR_ANGLE - Math.PI / 2,
      MAX_POLAR_ANGLE - Math.PI / 2
    );

    eulerRef.current.set(constrainedBeta, alphaRad, gammaRad, "YXZ");
    quaternionRef.current.setFromEuler(eulerRef.current);

    // Smooth quaternion interpolation
    currentQuaternionRef.current.slerp(quaternionRef.current, LERP_FACTOR);

    // Update camera position with smoothed quaternion
    targetPositionRef.current
      .set(0, 0, cameraDistance)
      .applyQuaternion(currentQuaternionRef.current);

    // Smooth position interpolation
    camera.position.lerp(targetPositionRef.current, LERP_FACTOR);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
