import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { MathUtils, MeshStandardMaterial } from "three";

import axios from "axios";

import { TEST } from "./test";

const AVATAR_URL = "/3d/avatars/avatar-1.glb";
const ANIMATIONS_URL = "/3d/avatars/animations-2.glb";

const ANIMATION_FADE_TIME = 0.5;

export default function Model(props) {
  //////TEMPORARY TESTING: MESSAGE STORAGE

  const [tempMessage, setTempMessage] = useState({});

  useEffect(() => {
    getViseme();
  }, []);

  async function getViseme() {
    const text = "HELLO WORLD My name is John Doe and I am a software engineer";

    const audioRes = await axios.post("/api/azure-tts", { text }, { responseType: "blob" });

    // Get audio as blob
    const audio = audioRes.data; // Since the response is now a blob, it's stored in audioRes.data
    const visemes = JSON.parse(audioRes.headers.visemes); // Use headers to get viseme data

    // Create an audio URL
    const audioUrl = URL.createObjectURL(audio);
    const audioPlayer = new Audio(audioUrl);

    // Set visemes and audio player into message
    let message = {};
    message.visemes = visemes;
    message.audioPlayer = audioPlayer;

    message.audioPlayer.currentTime = 0;
    message.audioPlayer.play();

    // Update state with the message
    setTempMessage(message);
  }

  const group = useRef();

  const { scene } = useGLTF(AVATAR_URL);
  useEffect(() => {
    scene.traverse((child) => {
      if (child.material) {
        child.material = new MeshStandardMaterial({
          map: child.material.map,
        });
      }
    });
  }, [scene]);

  const { animations } = useGLTF(ANIMATIONS_URL);
  console.log(animations);

  const { actions, mixer } = useAnimations(animations, group);
  const [animation, setAnimation] = useState("Talking2");

  useFrame(({ camera }) => {
    // Smile
    lerpMorphTarget("mouthSmile", 0.2, 0.5);
    // Blinking
    lerpMorphTarget("eye_close", true ? 1 : 0, 0.5);

    // Talking
    for (let i = 0; i <= 21; i++) {
      lerpMorphTarget(i, 0, 0.1); // reset morph targets
    }

    if (tempMessage && tempMessage.visemes && tempMessage.audioPlayer) {
      for (let i = tempMessage.visemes.length - 1; i >= 0; i--) {
        const viseme = tempMessage.visemes[i];
        if (tempMessage.audioPlayer.currentTime * 1000 >= viseme[0]) {
          lerpMorphTarget(viseme[1], 1, 0.2);
          break;
        }
      }
      if (actions[animation].time > actions[animation].getClip().duration - ANIMATION_FADE_TIME) {
        setAnimation((animation) => (animation === "Talking" ? "Talking2" : "Talking")); // Could load more type of animations and randomization here
      }
    }
  });

  //lerph morph target
  const lerpMorphTarget = (target, value, speed = 0.1) => {
    scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];

        if (index === undefined || child.morphTargetInfluences[index] === undefined) {
          return;
        }
        child.morphTargetInfluences[index] = MathUtils.lerp(child.morphTargetInfluences[index], value, speed);
      }
    });
  };

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
