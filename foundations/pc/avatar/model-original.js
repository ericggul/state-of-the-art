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
    scale: [4, 4, 4],
    position: [0, -0.8, 96], // Keep z-position to maintain visibility
    rotation: [Math.PI * 0.05, 0, 0],
  };

  const [wireframe, setWireframe] = useState(false);

  //////TEMPORARY TESTING: MESSAGE STORAGE
  const { visemeMessage } = useViseme();
  const { blink } = useBlink();

  const group = useRef();
  const { scene } = useGLTF(AVATAR_URL);
  const { animations } = useGLTF(ANIMATIONS_URL);
  const { actions, mixer } = useAnimations(animations, group);

  const [animation, setAnimation] = useState("Idle");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isInitializedRef = useRef(false);

  // Helper function to randomly select animation from a group
  const getRandomAnimation = (type) => {
    const animations = {
      talking: ["Talking", "Talking2", "Talking3", "Talking4", "Talking5"],
      idle: ["Idle", "Idle2"],
    };
    const options = animations[type];
    return options[Math.floor(Math.random() * options.length)];
  };

  // Enhanced animation control
  useEffect(() => {
    // Skip if this is the first render
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      return;
    }

    const handleAnimationChange = async () => {
      // If there's no visemeMessage or audio is ended/paused, go to idle
      if (!visemeMessage || visemeMessage?.audioPlayer?.paused) {
        if (!animation.startsWith("Idle")) {
          setAnimation(getRandomAnimation("idle"));
        }
        return;
      }

      // Only start talking if we have active audio
      if (visemeMessage?.audioPlayer?.paused === false) {
        if (!animation.startsWith("Talk")) {
          setAnimation(getRandomAnimation("talking"));
        }
      }
    };

    handleAnimationChange();
  }, [visemeMessage?.audioPlayer?.paused, visemeMessage]); // Watch both the message and paused state

  // Add a separate effect for transition animations during talking
  useFrame(({ camera }) => {
    // Smile
    lerpMorphTarget("mouthSmile", 0.5, 0.2);
    // Blinking
    lerpMorphTarget("eyeBlinkLeft", blink ? 1 : 0, 0.2);
    lerpMorphTarget("eyeBlinkRight", blink ? 1 : 0, 0.2);

    const appliedMorphTargets = [];
    if (visemeMessage && visemeMessage.visemes && visemeMessage.audioPlayer) {
      const currentTime = visemeMessage.audioPlayer.currentTime * 1000;

      for (let i = visemeMessage.visemes.length - 1; i >= 0; i--) {
        const [visemeTime, visemeId] = visemeMessage.visemes[i];
        if (currentTime >= visemeTime) {
          const targetMorph = VISME_TO_MORPHTARGET_MAP[visemeId];
          if (targetMorph) {
            appliedMorphTargets.push(targetMorph);
            lerpMorphTarget(targetMorph, 1, 0.2);
          }
          break;
        }
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
    <group {...props} dispose={null} ref={group}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(AVATAR_URL);
useGLTF.preload(ANIMATIONS_URL);
