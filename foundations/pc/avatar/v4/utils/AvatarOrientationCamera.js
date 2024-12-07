import React, { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useSocketScreenOrientation from "@/utils/socket/orientation/useSocketScreen";

const LERPING_FACTOR = 0.02;
const ZOOM_LERPING_FACTOR = 0.03;

const ZOOM_LIMITS = {
  MIN: 1,
  MAX: 2,
  DEFAULT: 1,
};

export function AvatarOrientationCamera({ cameraDistance = 3 }) {
  const { camera } = useThree();

  const sensorDataRef = useRef({
    orientation: { alpha: 0, beta: 0, gamma: 0 },
  });

  const eulerRef = useRef(new THREE.Euler());
  const quaternionRef = useRef(new THREE.Quaternion());
  const targetPositionRef = useRef(new THREE.Vector3());
  const currentDistanceRef = useRef(cameraDistance);
  const zoomFactorRef = useRef(1);
  const internalZoomRef = useRef(1);
  const lastAccelRef = useRef(new THREE.Vector3());

  const handleNewMobileOrientation = (data) => {
    sensorDataRef.current = data;
  };

  useSocketScreenOrientation({
    handleNewMobileOrientation,
  });

  useFrame(() => {
    const { orientation, acceleration } = sensorDataRef.current;
    let { alpha, beta, gamma } = orientation;

    // Match OrientationCamera rotation direction
    alpha = -alpha;
    beta = -beta;
    gamma = -gamma;

    const alphaRad = THREE.MathUtils.degToRad(alpha);
    const betaRad = THREE.MathUtils.degToRad(beta);
    const gammaRad = THREE.MathUtils.degToRad(gamma);

    eulerRef.current.set(betaRad, alphaRad, gammaRad, "YXZ");
    quaternionRef.current.setFromEuler(eulerRef.current);

    // Handle zoom based on acceleration (if available)
    if (acceleration) {
      const currentAccel = new THREE.Vector3(
        acceleration.x,
        acceleration.y,
        acceleration.z
      );
      const accelDiff = currentAccel.clone().sub(lastAccelRef.current);
      const accelMagnitude = accelDiff.length();

      if (accelMagnitude > 0.05 && Math.abs(accelDiff.z) > 1.0) {
        const zoomSpeed = 0.3;
        const zoomDelta =
          Math.sign(accelDiff.z) * Math.pow(accelMagnitude, 1.6) * zoomSpeed;

        if (
          (zoomDelta > 0 && internalZoomRef.current < 1.5) ||
          (zoomDelta < 0 && internalZoomRef.current > 0.5)
        ) {
          internalZoomRef.current = THREE.MathUtils.clamp(
            internalZoomRef.current + zoomDelta,
            ZOOM_LIMITS.MIN,
            ZOOM_LIMITS.MAX
          );
        }
      }
      lastAccelRef.current.copy(currentAccel);
    }

    // Smooth interpolation of zoom factor
    zoomFactorRef.current = THREE.MathUtils.lerp(
      zoomFactorRef.current,
      internalZoomRef.current,
      ZOOM_LERPING_FACTOR
    );

    // Distance interpolation
    currentDistanceRef.current = THREE.MathUtils.lerp(
      currentDistanceRef.current,
      cameraDistance,
      LERPING_FACTOR
    );

    // Update camera position with interpolated zoom and distance
    const length = currentDistanceRef.current * zoomFactorRef.current;
    targetPositionRef.current
      .set(0, 0, length)
      .applyQuaternion(quaternionRef.current);
    camera.position.lerp(targetPositionRef.current, LERPING_FACTOR);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
