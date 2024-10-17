import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Center } from "@react-three/drei";
import { MathUtils, MeshStandardMaterial } from "three";

import useBlink from "./utils/useBlink";
import useViseme from "./utils/useViseme";

import { VISME_TO_MORPHTARGET_MAP } from "./utils/constant";

const AVATAR_URL = "/3d/avatars/avatar-1.glb";
const ANIMATIONS_URL = "/3d/avatars/animations-2.glb";

const ANIMATION_FADE_TIME = 0.5;

export default function Model(props) {
  const defaultProps = {
    scale: [2, 2, 2],
    position: [0, -0.4, 74], // Keep z-position to maintain visibility
    //rotate just a bit
    rotation: [Math.PI * 0.1, 0, 0],
  };

  // Merge default props with passed props
  const mergedProps = { ...defaultProps, ...props };

  //////TEMPORARY TESTING: MESSAGE STORAGE

  const { tempMessage } = useViseme();
  const { blink } = useBlink();

  const group = useRef();
  const { scene } = useGLTF(AVATAR_URL);
  const { animations } = useGLTF(ANIMATIONS_URL);
  const { actions, mixer } = useAnimations(animations, group);
  const [animation, setAnimation] = useState("Idle");

  //SCENE STYLING
  useEffect(() => {
    scene.traverse((child) => {
      if (child.material) {
        child.material = new MeshStandardMaterial({
          map: child.material.map,
          skinning: true,
        });
      }
    });
  }, [scene]);

  //BASIC ANIMATION CONTROL
  useEffect(() => {
    if (tempMessage) {
      setAnimation(Math.random() < 0.5 ? "Talking" : "Talking2");
    } else {
      setAnimation("Idle");
    }
  }, [tempMessage]);

  //USE FRAME
  useFrame(({ camera }) => {
    // Smile
    lerpMorphTarget("mouthSmile", 0.5, 0.2);
    // Blinking
    lerpMorphTarget("eyeBlinkLeft", blink ? 1 : 0, 0.2);
    lerpMorphTarget("eyeBlinkRight", blink ? 1 : 0, 0.2);

    const appliedMorphTargets = [];
    if (tempMessage && tempMessage.visemes && tempMessage.audioPlayer) {
      const currentTime = tempMessage.audioPlayer.currentTime * 1000;

      for (let i = tempMessage.visemes.length - 1; i >= 0; i--) {
        const [visemeTime, visemeId] = tempMessage.visemes[i];
        if (currentTime >= visemeTime) {
          const targetMorph = VISME_TO_MORPHTARGET_MAP[visemeId];
          if (targetMorph) {
            appliedMorphTargets.push(targetMorph);
            lerpMorphTarget(targetMorph, 1, 0.2);
          }
          break;
        }
      }
      if (
        actions[animation].time >
        actions[animation].getClip().duration - ANIMATION_FADE_TIME
      ) {
        setAnimation((animation) =>
          animation === "Talking" ? "Talking2" : "Talking"
        ); // Could load more type of animations and randomization here
      }
    }

    //for all the other stuffs set lerpmorphtarget to 0
    Object.values(VISME_TO_MORPHTARGET_MAP).forEach((value) => {
      if (appliedMorphTargets.includes(value)) {
        return;
      }
      lerpMorphTarget(value, 0, 0.15);
    });
  });

  //LERP MORPH TARGET
  const lerpMorphTarget = (target, value, speed = 0.1) => {
    scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (
          index === undefined ||
          child.morphTargetInfluences[index] === undefined
        ) {
          return;
        }
        child.morphTargetInfluences[index] = MathUtils.lerp(
          child.morphTargetInfluences[index],
          value,
          speed
        );
      }
    });
  };

  //ANIMATIONS
  useEffect(() => {
    actions[animation]
      ?.reset()
      .fadeIn(mixer.time > 0 ? ANIMATION_FADE_TIME : 0)
      .play();
    return () => {
      actions[animation]?.fadeOut(ANIMATION_FADE_TIME);
    };
  }, [animation, actions]);

  return (
    <group {...mergedProps} dispose={null} ref={group}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

useGLTF.preload(AVATAR_URL);
useGLTF.preload(ANIMATIONS_URL);
