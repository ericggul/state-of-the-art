const PATH = "/3d/avatars-test/final_model.glb";

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function ModelNoAnim({ position, scale, ...props }) {
  const group = useRef();
  const { nodes, materials } = useGLTF(PATH);

  const scaleArray = Array.isArray(scale) ? scale : Array(3).fill(scale);

  return (
    <group
      ref={group}
      position={position}
      scale={scaleArray}
      rotation={[0, 0, 0]}
      dispose={null}
      {...props}
    >
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <skinnedMesh
          geometry={nodes.Alpha_Joints.geometry}
          material={materials.Alpha_Joints_MAT}
          skeleton={nodes.Alpha_Joints.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Alpha_Surface.geometry}
          material={materials.Alpha_Body_MAT}
          skeleton={nodes.Alpha_Surface.skeleton}
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
            />
          )
        )}
        <primitive object={nodes.mixamorigHips} />
      </group>
    </group>
  );
}

useGLTF.preload(PATH);
