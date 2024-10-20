import React, { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useSocketScreenOrientation from "@/utils/socket/orientation/useSocketScreen";

const lerp = (start, end, t) => start * (1 - t) + end * t;

export function OrientationCamera() {
  const { camera } = useThree();
  const orientationRef = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const eulerRef = useRef(new THREE.Euler());
  const quaternionRef = useRef(new THREE.Quaternion());
  const targetPositionRef = useRef(new THREE.Vector3());
  const initialLengthRef = useRef(null);

  const handleNewMobileOrientation = (data) => {
    orientationRef.current = data.orientation;
  };

  useSocketScreenOrientation({ handleNewMobileOrientation });

  useFrame((state) => {
    const { alpha, beta, gamma } = orientationRef.current;

    // Convert degrees to radians for Three.js
    const alphaRad = THREE.MathUtils.degToRad(-alpha);
    const betaRad = THREE.MathUtils.degToRad(-beta);
    const gammaRad = THREE.MathUtils.degToRad(-gamma);

    eulerRef.current.set(betaRad, alphaRad, gammaRad, "YXZ");
    quaternionRef.current.setFromEuler(eulerRef.current);

    // Store the initial length on the first frame
    if (initialLengthRef.current === null) {
      initialLengthRef.current = camera.position.length();
    }
    const length = initialLengthRef.current;

    targetPositionRef.current
      .set(0, 0, length)
      .applyQuaternion(quaternionRef.current);

    // Lerp the camera position for smooth movement
    camera.position.lerp(targetPositionRef.current, 0.05);
    camera.lookAt(0, 0, 0); // Ensure camera is always looking at the origin
  });

  useEffect(() => {
    const originalPosition = camera.position.clone();
    const originalRotation = camera.rotation.clone();

    return () => {
      camera.position.copy(originalPosition);
      camera.rotation.copy(originalRotation);
    };
  }, [camera]);

  return null;
}
