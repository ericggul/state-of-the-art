import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { MathUtils, MeshStandardMaterial } from "three";

import axios from "axios";

import { TEST } from "./test";

const VISME_TO_MORPHTARGET_MAP = {
  0: "viseme_sil", // Silence
  1: "viseme_aa", // æ, ə, ʌ
  2: "viseme_aa", // ɑ
  3: "viseme_O", // ɔ
  4: "viseme_E", // ɛ, ʊ
  5: "viseme_RR", // ɝ
  6: "viseme_I", // j, i, ɪ
  7: "viseme_U", // w, u
  8: "viseme_O", // o
  9: "viseme_O", // aʊ
  10: "viseme_O", // ɔɪ
  11: "viseme_aa", // aɪ
  12: "viseme_E", // h
  13: "viseme_RR", // ɹ
  14: "viseme_kk", // l
  15: "viseme_SS", // s, z
  16: "viseme_CH", // ʃ, tʃ, dʒ, ʒ
  17: "viseme_TH", // ð
  18: "viseme_FF", // f, v
  19: "viseme_DD", // d, t, n, θ
  20: "viseme_kk", // k, g, ŋ
  21: "viseme_PP", // p, b, m
};
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
    const text = "HELLO WORLD My name is John Doe and I am a software engineer. I hate you so much that I wanna kill you.";

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

  const { actions, mixer } = useAnimations(animations, group);
  const [animation, setAnimation] = useState("Talking4");

  useFrame(({ camera }) => {
    // Smile
    lerpMorphTarget("mouthSmile", 0.2, 0.5);
    // Blinking
    lerpMorphTarget("eye_close", true ? 1 : 0, 0.5);

    // Talking
    for (let i = 0; i <= 21; i++) {
      lerpMorphTarget(i, 0, 0.1); // reset morph targets
    }

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
      if (actions[animation].time > actions[animation].getClip().duration - ANIMATION_FADE_TIME) {
        setAnimation((animation) => (animation === "Talking" ? "Talking2" : "Talking")); // Could load more type of animations and randomization here
      }
    }

    //for all the other stuffs set lerpmorphtarget to 0
    Object.values(VISME_TO_MORPHTARGET_MAP).forEach((value) => {
      if (appliedMorphTargets.includes(value)) {
        return;
      }
      lerpMorphTarget(value, 0, 0.1);
    });
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
