const PATH = "/3d/avatars/final_model.glb";
const ANIMATIONS_URL = "/3d/avatars/animations/final_animation.glb";
const DEFAULT_MODEL_CONTROLS = {
  position: [0, -2.1, 0],
  scale: 2,
};

const MORPH_SPEEDS = {
  SMILE: 0.2,
  BLINK: 0.2,
  VISEME: 0.2,
  RESET: 0.15,
};

const SMILE_VALUE = 0.5;

import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import useBlink from "../utils/useBlink";
import useViseme from "../utils/useViseme";
import { VISME_TO_MORPHTARGET_MAP } from "../utils/constant";

// Logic Hook
function useModelLogic() {
  const group = useRef();
  const { nodes, materials } = useGLTF(PATH);
  const { animations } = useGLTF(ANIMATIONS_URL);
  const { actions } = useAnimations(animations, group);
  const { visemeMessage } = useViseme();
  const { blink } = useBlink();

  const scaleArray = Array.isArray(DEFAULT_MODEL_CONTROLS.scale)
    ? DEFAULT_MODEL_CONTROLS.scale
    : Array(3).fill(DEFAULT_MODEL_CONTROLS.scale);

  useEffect(() => {
    actions["Armature|mixamo.com|Layer0"].play();
  }, [actions]);

  const lerpMorphTarget = (target, value, speed = 0.1) => {
    group.current?.traverse((child) => {
      if (!child.isSkinnedMesh || !child.morphTargetDictionary) return;

      const index = child.morphTargetDictionary[target];
      if (
        index === undefined ||
        child.morphTargetInfluences[index] === undefined
      )
        return;

      child.morphTargetInfluences[index] = MathUtils.lerp(
        child.morphTargetInfluences[index],
        value,
        speed
      );
    });
  };

  useFrame(() => {
    // Handle fixed expressions
    lerpMorphTarget("mouthSmile", SMILE_VALUE, MORPH_SPEEDS.SMILE);
    lerpMorphTarget("eyeBlinkLeft", blink ? 1 : 0, MORPH_SPEEDS.BLINK);
    lerpMorphTarget("eyeBlinkRight", blink ? 1 : 0, MORPH_SPEEDS.BLINK);

    // Handle visemes
    const appliedMorphTargets = new Set();
    if (visemeMessage?.visemes?.length && visemeMessage.audioPlayer) {
      const currentTime = visemeMessage.audioPlayer.currentTime * 1000;

      for (let i = visemeMessage.visemes.length - 1; i >= 0; i--) {
        const [visemeTime, visemeId] = visemeMessage.visemes[i];
        if (currentTime >= visemeTime) {
          const targetMorph = VISME_TO_MORPHTARGET_MAP[visemeId];
          if (targetMorph) {
            appliedMorphTargets.add(targetMorph);
            lerpMorphTarget(targetMorph, 1, MORPH_SPEEDS.VISEME);
          }
          break;
        }
      }
    }

    // Reset unused morph targets
    Object.values(VISME_TO_MORPHTARGET_MAP).forEach((morphTarget) => {
      if (!appliedMorphTargets.has(morphTarget)) {
        lerpMorphTarget(morphTarget, 0, MORPH_SPEEDS.RESET);
      }
    });
  });

  return {
    group,
    nodes,
    materials,
    scaleArray,
  };
}

// Presentation Component
function ModelEl({ group, nodes, materials, scaleArray }) {
  return (
    <group
      ref={group}
      position={DEFAULT_MODEL_CONTROLS.position}
      scale={scaleArray}
      rotation={[0, 0, 0]}
      dispose={null}
    >
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <skinnedMesh
          geometry={nodes.Alpha_Joints.geometry}
          material={materials.Alpha_Joints_MAT}
          skeleton={nodes.Alpha_Joints.skeleton}
          castShadow
        />
        <skinnedMesh
          geometry={nodes.Alpha_Surface.geometry}
          material={materials.Alpha_Body_MAT}
          skeleton={nodes.Alpha_Surface.skeleton}
          castShadow
        />
        {["EyeLeft001", "EyeRight001", "Wolf3D_Head001", "Wolf3D_Teeth001"].map(
          (name) => (
            <skinnedMesh
              key={name}
              name={name}
              geometry={nodes[name].geometry}
              material={
                materials[
                  name.includes("Eye")
                    ? "Wolf3D_Eye.001"
                    : name.includes("Teeth")
                    ? "Wolf3D_Teeth.001"
                    : "Wolf3D_Skin.001"
                ]
              }
              skeleton={nodes[name].skeleton}
              morphTargetDictionary={nodes[name].morphTargetDictionary}
              morphTargetInfluences={nodes[name].morphTargetInfluences}
              castShadow
            />
          )
        )}
        <primitive object={nodes.mixamorigHips} />
      </group>
    </group>
  );
}

// Main Component
export default function Model() {
  const modelLogic = useModelLogic();

  return (
    <>
      <ModelEl {...modelLogic} />
    </>
  );
}

useGLTF.preload(PATH);
useGLTF.preload(ANIMATIONS_URL);
