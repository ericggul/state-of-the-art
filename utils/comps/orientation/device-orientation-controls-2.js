import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";

export default function DeviceOrientationControls() {
  const [orientation, setOrientation] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });

  const eulerRef = useRef(new THREE.Euler());
  const quaternionRef = useRef(new THREE.Quaternion());
  const targetPositionRef = useRef(new THREE.Vector3());
  const zee = new THREE.Vector3(0, 0, 1);
  const q0 = new THREE.Quaternion();
  const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

  const orientationDetector = (e) => {
    setOrientation({
      alpha: e.alpha || 0,
      beta: e.beta || 0,
      gamma: e.gamma || 0,
    });
  };

  useEffect(() => {
    window.addEventListener("deviceorientation", orientationDetector);
    return () => {
      window.removeEventListener("deviceorientation", orientationDetector);
    };
  }, []);

  useFrame((state) => {
    const { alpha, beta, gamma } = orientation;

    // Convert degrees to radians for Three.js
    const alphaRad = THREE.MathUtils.degToRad(alpha);
    const betaRad = THREE.MathUtils.degToRad(beta);
    const gammaRad = THREE.MathUtils.degToRad(gamma);
    // const orientRad = THREE.MathUtils.degToRad(window.orientation || 0);

    // The angles alpha, beta, and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''
    eulerRef.current.set(betaRad, alphaRad, -gammaRad, "YXZ");
    quaternionRef.current.setFromEuler(eulerRef.current);

    // Multiply quaternions to adjust for device orientation
    quaternionRef.current.multiply(q1);
    // quaternionRef.current.multiply(q0.setFromAxisAngle(zee, -orientRad));

    const length = 100; // Adjust length as needed
    targetPositionRef.current.set(0, 0, length).applyQuaternion(quaternionRef.current);

    state.camera.position.lerp(targetPositionRef.current, 0.15);
    state.camera.lookAt(0, 0, 0); // Ensure camera is always looking at the origin
  });

  return null;
}
