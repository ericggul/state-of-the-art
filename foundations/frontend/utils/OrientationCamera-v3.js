import React, { useRef, useEffect, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useSocketScreenOrientation from "@/utils/socket/orientation/useSocketScreen";
import useScreenStore from "@/components/screen/store";
import { useOrientationAudio } from "./useOrientationAudio";

const lerp = (start, end, t) => start * (1 - t) + end * t;
const LERPING_FACTOR = 0.03;

export function OrientationCamera({ cameraDistance = 100 }) {
  const { camera } = useThree();
  const sensorDataRef = useRef({
    orientation: { alpha: 0, beta: 0, gamma: 0 },
    acceleration: { x: 0, y: 0, z: 0 },
  });
  const eulerRef = useRef(new THREE.Euler());
  const quaternionRef = useRef(new THREE.Quaternion());
  const targetPositionRef = useRef(new THREE.Vector3());
  const currentDistanceRef = useRef(cameraDistance);
  const targetDistanceRef = useRef(cameraDistance);
  const zoomFactorRef = useRef(1);
  const targetZoomFactorRef = useRef(1);
  const lastAccelRef = useRef(new THREE.Vector3());

  const {
    playShakeSound,
    updateZoomAudio,
    cleanup: cleanupAudio,
  } = useOrientationAudio();

  const handleNewMobileOrientation = (data) => {
    sensorDataRef.current = data;
  };

  useSocketScreenOrientation({
    handleNewMobileOrientation,
  });

  useFrame((state, delta) => {
    const { orientation, acceleration } = sensorDataRef.current;
    const { alpha, beta, gamma } = orientation;

    // Convert degrees to radians for Three.js
    const alphaRad = THREE.MathUtils.degToRad(-alpha);
    const betaRad = THREE.MathUtils.degToRad(-beta);
    const gammaRad = THREE.MathUtils.degToRad(-gamma);

    eulerRef.current.set(betaRad, alphaRad, gammaRad, "YXZ");
    quaternionRef.current.setFromEuler(eulerRef.current);

    // Update target zoom factor based on all acceleration axes
    const zoomSpeed = 0.3;
    const currentAccel = new THREE.Vector3(
      acceleration.x,
      acceleration.y,
      acceleration.z
    );
    const accelDiff = currentAccel.sub(lastAccelRef.current);
    const accelMagnitude = accelDiff.length();

    if (accelMagnitude > 0.05) {
      // Only use significant z-axis movement
      if (Math.abs(accelDiff.z) > 1.0) {
        const zoomDelta =
          Math.sign(accelDiff.z) * Math.pow(accelMagnitude, 1.6) * zoomSpeed;

        // Add hysteresis to prevent rapid flipping
        if (
          (zoomDelta > 0 && targetZoomFactorRef.current < 1.5) ||
          (zoomDelta < 0 && targetZoomFactorRef.current > 1.5)
        ) {
          targetZoomFactorRef.current += zoomDelta;
        }

        targetZoomFactorRef.current = THREE.MathUtils.clamp(
          targetZoomFactorRef.current,
          0.01,
          3
        );

        playShakeSound(accelMagnitude);
      }
    }

    lastAccelRef.current.copy(currentAccel);

    // Smoothly interpolate current distance towards target distance
    currentDistanceRef.current = lerp(
      currentDistanceRef.current,
      targetDistanceRef.current,
      LERPING_FACTOR
    );

    // Smoothly interpolate current zoom factor towards target zoom factor
    zoomFactorRef.current = lerp(
      zoomFactorRef.current,
      targetZoomFactorRef.current,
      LERPING_FACTOR
    );

    // console.log(zoomFactorRef.current);

    const length = currentDistanceRef.current * zoomFactorRef.current;

    targetPositionRef.current
      .set(0, 0, length)
      .applyQuaternion(quaternionRef.current);

    // Lerp the camera position for smooth movement
    camera.position.lerp(targetPositionRef.current, LERPING_FACTOR);
    camera.lookAt(0, 0, 0); // Ensure camera is always looking at the origin

    // Update audio based on zoom factor
    updateZoomAudio(zoomFactorRef.current);
  });

  useEffect(() => {
    const originalPosition = camera.position.clone();
    const originalRotation = camera.rotation.clone();

    return () => {
      camera.position.copy(originalPosition);
      camera.rotation.copy(originalRotation);
      cleanupAudio(); // Clean up the audio when component unmounts
    };
  }, [camera, cleanupAudio]);

  useEffect(() => {
    // When cameraDistance changes, update targetDistanceRef
    targetDistanceRef.current = cameraDistance;
  }, [cameraDistance]);

  return null;
}
