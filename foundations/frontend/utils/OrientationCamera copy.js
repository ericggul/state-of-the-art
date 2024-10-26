import React, { useRef, useEffect, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import * as Tone from "tone";
import useSocketScreenOrientation from "@/utils/socket/orientation/useSocketScreen";

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

  // Audio setup with minor improvements
  const synth = useMemo(() => {
    const s = new Tone.MonoSynth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.05, decay: 0.2, sustain: 0.4, release: 0.5 },
    }).toDestination();
    s.volume.value = -25; // Slightly lower initial volume
    return s;
  }, []);

  const handleNewMobileOrientation = (data) => {
    sensorDataRef.current = data;
  };

  useSocketScreenOrientation({ handleNewMobileOrientation });

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
      const zoomDelta =
        Math.sign(accelDiff.z) * Math.pow(accelMagnitude, 1.6) * zoomSpeed;
      targetZoomFactorRef.current += zoomDelta;
      targetZoomFactorRef.current = THREE.MathUtils.clamp(
        targetZoomFactorRef.current,
        0.01,
        3
      );

      const shakeFrequency = THREE.MathUtils.mapLinear(
        accelMagnitude,
        0,
        2,
        150,
        600
      );
      // Play sound for shake with improved frequency mapping
      try {
        synth.triggerAttackRelease(shakeFrequency, "32n", undefined, 0.3);
      } catch (e) {
        console.log(e);
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

    // Lerp the camera position for smooth movement
    camera.position.lerp(targetPositionRef.current, LERPING_FACTOR);
    camera.lookAt(0, 0, 0); // Ensure camera is always looking at the origin

    // Update audio based on zoom factor with smoother transitions
    const zoomFrequency = THREE.MathUtils.mapLinear(
      zoomFactorRef.current,
      0.01,
      3,
      120,
      800
    );
    synth.frequency.rampTo(zoomFrequency, 0.2);
    const zoomVolume = THREE.MathUtils.mapLinear(
      zoomFactorRef.current,
      0.01,
      3,
      -35,
      -15
    );
    synth.volume.rampTo(zoomVolume, 0.2);
  });

  useEffect(() => {
    const originalPosition = camera.position.clone();
    const originalRotation = camera.rotation.clone();

    return () => {
      camera.position.copy(originalPosition);
      camera.rotation.copy(originalRotation);
      synth.dispose(); // Clean up the synth when component unmounts
    };
  }, [camera, synth]);

  useEffect(() => {
    // When cameraDistance changes, update targetDistanceRef
    targetDistanceRef.current = cameraDistance;
  }, [cameraDistance]);

  return null;
}
