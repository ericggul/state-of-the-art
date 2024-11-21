import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function DeviceOrientationControls() {
  const orientationRef = useRef({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });

  const eulerRef = useRef(new THREE.Euler());
  const quaternionRef = useRef(new THREE.Quaternion());
  const targetPositionRef = useRef(new THREE.Vector3());
  const orbitControlsRef = useRef();

  useEffect(() => {
    const handleDeviceOrientation = (event) => {
      orientationRef.current = {
        alpha: event.alpha ?? 0,
        beta: event.beta ?? 0,
        gamma: event.gamma ?? 0,
      };
    };

    window.addEventListener("deviceorientation", handleDeviceOrientation, true);

    return () => {
      window.removeEventListener(
        "deviceorientation",
        handleDeviceOrientation,
        true
      );
    };
  }, []);

  useFrame((state) => {
    const { alpha, beta, gamma } = orientationRef.current;

    // Convert degrees to radians for Three.js
    const alphaRad = THREE.MathUtils.degToRad(-alpha);
    const betaRad = THREE.MathUtils.degToRad(-beta);
    const gammaRad = THREE.MathUtils.degToRad(-gamma);

    eulerRef.current.set(betaRad, alphaRad, gammaRad, "YXZ");
    quaternionRef.current.setFromEuler(eulerRef.current);

    // Use current camera distance for orbit
    const currentDistance = state.camera.position.length();

    targetPositionRef.current
      .set(0, 0, currentDistance)
      .applyQuaternion(quaternionRef.current);

    // Adjust for initial camera offset while maintaining distance
    targetPositionRef.current.normalize().multiplyScalar(currentDistance);
    targetPositionRef.current.z += 10;

    state.camera.position.lerp(targetPositionRef.current, 0.06);
    state.camera.lookAt(0, 0, 0);

    // Update OrbitControls target
    if (orbitControlsRef.current) {
      orbitControlsRef.current.target.set(0, 0, 0);
      orbitControlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={orbitControlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={false}
      minDistance={5}
      maxDistance={100}
      zoomSpeed={0.5}
    />
  );
}
