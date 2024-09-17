import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import * as Tone from "tone";
import useSocket from "utils/socket/orientation/useSocketScreen";

import { STRUCTURE } from "../structure";

function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export default function DeviceOrientationControls({ layerIdx }) {
  const socket = useSocket({ handleNewMobileOrientation });
  const orientationRef = useRef({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });

  const eulerRef = useRef(new THREE.Euler());
  const quaternionRef = useRef(new THREE.Quaternion());
  const targetPositionRef = useRef(new THREE.Vector3());

  const initialLengthRef = useRef(null);

  const synth = useMemo(() => {
    //Osc
    //AM
    //PWM

    const osc = new Tone.Oscillator({
      type: "sine",
      // frequency: 440, // A4
      frequency: 440,
      volume: -10,
    }).toDestination();

    osc.start();
    return osc;
  }, []);

  function handleNewMobileOrientation(data) {
    orientationRef.current = data.orientation;

    const { alpha, beta, gamma } = orientationRef.current;

    console.log("43");
    // Map alpha to pitch (frequency)
    const frequency = mapRange(alpha, 0, 360, 200, 1000);
    synth.frequency.setValueAtTime(frequency, Tone.now());

    // Map beta to filter frequency
    const filterFreq = mapRange(beta, -180, 180, 200, 2000);
    synth.set({ filter: { frequency: filterFreq } });

    // Map gamma to amplitude (volume)
    const volume = mapRange(gamma, -90, 90, -20, 0);
    synth.volume.setValueAtTime(volume, Tone.now());
  }

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
      initialLengthRef.current = state.camera.position.length();
    }
    const length = initialLengthRef.current;

    targetPositionRef.current.set(0, 0, length).applyQuaternion(quaternionRef.current);

    // move the camera  STRUCTURE[layerIdx].position[2] towards z-axis
    targetPositionRef.current.z += STRUCTURE[layerIdx].position[2];

    state.camera.position.lerp(targetPositionRef.current, 0.12);
    state.camera.lookAt(0, 0, STRUCTURE[layerIdx].position[2]); // Ensure camera is always looking at the origin
  });

  return null;
}
