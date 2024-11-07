import React, { useRef, useEffect, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useSocketScreenOrientation from "@/utils/socket/orientation/useSocketScreen";
import useScreenStore from "@/components/screen/store";
import { useOrientationAudio } from "../useOrientationAudio";

const lerp = (start, end, t) => start * (1 - t) + end * t;
const LERPING_FACTOR = 0.03;

// Add zoom factor limits
const ZOOM_LIMITS = {
  MIN: 0.01,
  MAX: 3,
  DEFAULT: 1,
};

export function OrientationCamera({
  cameraDistance = 100,
  initialZoom = ZOOM_LIMITS.DEFAULT,
}) {
  const { camera } = useThree();
  const zoomFactor = useScreenStore((state) => state.zoomFactor);
  const setZoomFactor = useScreenStore((state) => state.setZoomFactor);

  const sensorDataRef = useRef({
    orientation: { alpha: 0, beta: 0, gamma: 0 },
    acceleration: { x: 0, y: 0, z: 0 },
  });
  const eulerRef = useRef(new THREE.Euler());
  const quaternionRef = useRef(new THREE.Quaternion());
  const targetPositionRef = useRef(new THREE.Vector3());
  const currentDistanceRef = useRef(cameraDistance);
  const targetDistanceRef = useRef(cameraDistance);
  const zoomFactorRef = useRef(initialZoom);
  const targetZoomFactorRef = useRef(initialZoom);
  const lastAccelRef = useRef(new THREE.Vector3());

  // Update target zoom when store zoomFactor changes
  useEffect(() => {
    const clampedZoom = THREE.MathUtils.clamp(
      zoomFactor,
      ZOOM_LIMITS.MIN,
      ZOOM_LIMITS.MAX
    );
    targetZoomFactorRef.current = clampedZoom;
  }, [zoomFactor]);

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

    // Update zoom based on acceleration
    const zoomSpeed = 0.3;
    const currentAccel = new THREE.Vector3(
      acceleration.x,
      acceleration.y,
      acceleration.z
    );
    const accelDiff = currentAccel.sub(lastAccelRef.current);
    const accelMagnitude = accelDiff.length();

    if (accelMagnitude > 0.05) {
      if (Math.abs(accelDiff.z) > 1.0) {
        const zoomDelta =
          Math.sign(accelDiff.z) * Math.pow(accelMagnitude, 1.6) * zoomSpeed;

        if (
          (zoomDelta > 0 && zoomFactor < 1.5) ||
          (zoomDelta < 0 && zoomFactor > 1.5)
        ) {
          const newZoom = THREE.MathUtils.clamp(
            zoomFactor + zoomDelta,
            ZOOM_LIMITS.MIN,
            ZOOM_LIMITS.MAX
          );
          setZoomFactor(newZoom);
        }

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

    const length = currentDistanceRef.current * zoomFactorRef.current;

    targetPositionRef.current
      .set(0, 0, length)
      .applyQuaternion(quaternionRef.current);

    camera.position.lerp(targetPositionRef.current, LERPING_FACTOR);
    camera.lookAt(0, 0, 0);

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
