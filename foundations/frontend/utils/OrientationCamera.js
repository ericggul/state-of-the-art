import React, { useRef, useEffect, memo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { DynamicCamera } from "./DynamicCamera";
import useSocketScreenOrientation from "@/utils/socket/orientation/useSocketScreen";
import useScreenStore from "@/components/screen/store";
import { useOrientationAudio } from "./useOrientationAudio";

const lerp = (start, end, t) => start + (end - start) * t;
const LERPING_FACTOR = 0.03;
const ZOOM_LERPING_FACTOR = 0.03;

const ZOOM_LIMITS = {
  MIN: 0.05,
  MAX: 3,
  DEFAULT: 1,
};

export const OrientationCamera = memo(
  function OrientationCamera({
    cameraDistance = 100,
    initialZoom = ZOOM_LIMITS.DEFAULT,
  }) {
    const { camera } = useThree();
    const externalZoomFactor = useScreenStore((state) => state.zoomFactor);
    const setZoomFactor = useScreenStore((state) => state.setZoomFactor);
    const isAccelerometerActive = useScreenStore(
      (state) => state.isAccelerometerActive
    );
    const setIsAccelerometerActive = useScreenStore(
      (state) => state.setIsAccelerometerActive
    );

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
    const internalZoomRef = useRef(1);
    const lastAccelRef = useRef(new THREE.Vector3());

    const {
      playShakeSound,
      updateZoomAudio,
      cleanup: cleanupAudio,
    } = useOrientationAudio();

    // Add a ref to track if we've activated the accelerometer
    const hasActivatedRef = useRef(false);

    useSocketScreenOrientation({
      handleNewMobileOrientation: (data) => {
        sensorDataRef.current = data;
        // Only set once using the ref
        if (!hasActivatedRef.current) {
          setIsAccelerometerActive(true);
          hasActivatedRef.current = true;
        }
      },
      handleNewMobileOrientationSpike: (data) => {
        console.log("new mobile orientation spike", data);
      },
    });

    useEffect(() => {
      const originalPosition = camera.position.clone();
      const originalRotation = camera.rotation.clone();

      return () => {
        camera.position.copy(originalPosition);
        camera.rotation.copy(originalRotation);
        cleanupAudio();
      };
    }, [camera, cleanupAudio]);

    useEffect(() => {
      targetDistanceRef.current = cameraDistance;
    }, [cameraDistance]);

    useFrame(() => {
      if (!isAccelerometerActive) return;

      const { orientation, acceleration } = sensorDataRef.current;
      let { alpha, beta, gamma } = orientation;

      // Adjust the angles to synchronize the rotation direction
      // alpha = -alpha; // Invert alpha
      // beta = beta; // Keep beta as is
      // gamma = gamma; // Keep gamma as is

      //ORIGINAL
      alpha = -alpha;
      beta = -beta;
      gamma = -gamma;

      // Convert degrees to radians for Three.js
      const alphaRad = THREE.MathUtils.degToRad(alpha);
      const betaRad = THREE.MathUtils.degToRad(beta);
      const gammaRad = THREE.MathUtils.degToRad(gamma);

      eulerRef.current.set(betaRad, alphaRad, gammaRad, "YXZ");
      quaternionRef.current.setFromEuler(eulerRef.current);

      // Handle internal zoom based on acceleration
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
          playShakeSound(accelMagnitude);
        }
      }

      lastAccelRef.current.copy(currentAccel);

      // Combine internal and external zoom factors
      const combinedZoom = internalZoomRef.current * externalZoomFactor;

      // Smooth interpolation of actual zoom
      zoomFactorRef.current = lerp(
        zoomFactorRef.current,
        combinedZoom,
        ZOOM_LERPING_FACTOR
      );

      // Distance interpolation
      currentDistanceRef.current = lerp(
        currentDistanceRef.current,
        targetDistanceRef.current,
        LERPING_FACTOR
      );

      // Position update with combined zoom
      const length = currentDistanceRef.current * zoomFactorRef.current;
      targetPositionRef.current
        .set(0, 0, length)
        .applyQuaternion(quaternionRef.current);
      camera.position.lerp(targetPositionRef.current, LERPING_FACTOR);
      camera.lookAt(0, 0, 0);

      // Clamp the audio zoom value between 0 and 1
      const audioZoomValue = THREE.MathUtils.clamp(
        zoomFactorRef.current / ZOOM_LIMITS.MAX,
        0,
        1
      );
      updateZoomAudio(audioZoomValue);
    });

    if (!isAccelerometerActive) {
      return <DynamicCamera cameraDistance={cameraDistance} />;
    }

    return null;
  },
  (prevProps, nextProps) => {
    return (
      prevProps.cameraDistance === nextProps.cameraDistance &&
      prevProps.initialZoom === nextProps.initialZoom
    );
  }
);

OrientationCamera.displayName = "OrientationCamera";
