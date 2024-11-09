import React, { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useSocketScreenOrientation from "@/utils/socket/orientation/useSocketScreen";

export function AvatarOrientationCamera({ cameraDistance = 3 }) {
  const { camera } = useThree();

  const sensorDataRef = useRef({
    orientation: { alpha: 0, beta: 0, gamma: 0 },
  });

  const eulerRef = useRef(new THREE.Euler());
  const quaternionRef = useRef(new THREE.Quaternion());
  const targetPositionRef = useRef(new THREE.Vector3());

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

    eulerRef.current.set(betaRad, alphaRad, gammaRad, "YXZ");
    quaternionRef.current.setFromEuler(eulerRef.current);

    // Update camera position
    targetPositionRef.current
      .set(0, 0, cameraDistance)
      .applyQuaternion(quaternionRef.current);
    camera.position.lerp(targetPositionRef.current, 0.1);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
