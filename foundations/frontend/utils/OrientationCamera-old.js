import React, { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useSocketScreenOrientation from "@/utils/socket/orientation/useSocketScreen";

const lerp = (start, end, t) => start * (1 - t) + end * t;

export function OrientationCamera() {
  const { camera } = useThree();
  const sensorDataRef = useRef({
    orientation: { alpha: 0, beta: 0, gamma: 0 },
    acceleration: { x: 0, y: 0, z: 0 },
  });
  const eulerRef = useRef(new THREE.Euler());
  const quaternionRef = useRef(new THREE.Quaternion());
  const targetPositionRef = useRef(new THREE.Vector3());
  const initialLengthRef = useRef(null);
  const zoomFactorRef = useRef(1);

  const handleNewMobileOrientation = (data) => {
    sensorDataRef.current = data;
  };

  useSocketScreenOrientation({ handleNewMobileOrientation });

  useFrame((state) => {
    const { orientation, acceleration } = sensorDataRef.current;
    const { alpha, beta, gamma } = orientation;

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

    // Update zoom factor based on z-axis acceleration
    const zoomSpeed = 1.5; // Increased from 0.8
    const zoomAcceleration =
      Math.pow(Math.abs(acceleration.z), 1.5) * Math.sign(acceleration.z);
    zoomFactorRef.current = lerp(
      zoomFactorRef.current,
      1 + zoomAcceleration * zoomSpeed,
      0.1
    );
    zoomFactorRef.current = THREE.MathUtils.clamp(
      zoomFactorRef.current,
      0.2, // Decreased minimum zoom (closer)
      3 // Increased maximum zoom (further)
    );

    const length = initialLengthRef.current * zoomFactorRef.current;

    console.log("zoom factor", zoomFactorRef.current);

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
