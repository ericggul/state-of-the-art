export const VISME_TO_MORPHTARGET_MAP = {
  0: "viseme_sil", // Silence -> Silence
  1: "viseme_aa", // æ, ə, ʌ -> 'aa' as in "bat"
  2: "viseme_aa", // ɑ -> 'aa' as in "hot"
  3: "viseme_O", // ɔ -> 'O' as in "force"
  4: "viseme_E", // ɛ, ʊ -> 'E' as in "met"
  5: "viseme_RR", // ɝ -> 'RR' as in "bird"
  6: "viseme_I", // j, i, ɪ -> 'I' as in "kit"
  7: "viseme_U", // w, u -> 'U' as in "boot"
  8: "viseme_O", // o -> 'O' as in "go"
  9: "viseme_O", // aʊ -> 'O' as in "now"
  10: "viseme_O", // ɔɪ -> 'O' as in "boy"
  11: "viseme_aa", // aɪ -> 'aa' as in "price"
  12: "viseme_E", // h -> 'E' (neutral position for /h/)
  13: "viseme_RR", // ɹ -> 'RR' for American R
  14: "viseme_nn", // l -> 'nn' (changed from kk, as /l/ is more similar to /n/)
  15: "viseme_SS", // s, z -> 'SS' for sibilants
  16: "viseme_CH", // ʃ, tʃ, dʒ, ʒ -> 'CH' for post-alveolar
  17: "viseme_TH", // ð -> 'TH' for dental fricatives
  18: "viseme_FF", // f, v -> 'FF' for labiodental
  19: "viseme_DD", // d, t, n, θ -> 'DD' for alveolar stops
  20: "viseme_kk", // k, g, ŋ -> 'kk' for velar consonants
  21: "viseme_PP", // p, b, m -> 'PP' for bilabial
};

const VISEME = {
  mouthOpen: 0,
  viseme_sil: 1,
  viseme_PP: 2,
  viseme_FF: 3,
  viseme_TH: 4,
  viseme_DD: 5,
  viseme_kk: 6,
  viseme_CH: 7,
  viseme_SS: 8,
  viseme_nn: 9,
  viseme_RR: 10,
  viseme_aa: 11,
  viseme_E: 12,
  viseme_I: 13,
  viseme_O: 14,
  viseme_U: 15,
  mouthSmile: 16,
  browDownLeft: 17,
  browDownRight: 18,
  browInnerUp: 19,
  browOuterUpLeft: 20,
  browOuterUpRight: 21,
  eyeSquintLeft: 22,
  eyeSquintRight: 23,
  eyeWideLeft: 24,
  eyeWideRight: 25,
  jawForward: 26,
  jawLeft: 27,
  jawRight: 28,
  mouthFrownLeft: 29,
  mouthFrownRight: 30,
  mouthPucker: 31,
  mouthShrugLower: 32,
  mouthShrugUpper: 33,
  noseSneerLeft: 34,
  noseSneerRight: 35,
  mouthLowerDownLeft: 36,
  mouthLowerDownRight: 37,
  mouthLeft: 38,
  mouthRight: 39,
  eyeLookDownLeft: 40,
  eyeLookDownRight: 41,
  eyeLookUpLeft: 42,
  eyeLookUpRight: 43,
  eyeLookInLeft: 44,
  eyeLookInRight: 45,
  eyeLookOutLeft: 46,
  eyeLookOutRight: 47,
  cheekPuff: 48,
  cheekSquintLeft: 49,
  cheekSquintRight: 50,
  jawOpen: 51,
  mouthClose: 52,
  mouthFunnel: 53,
  mouthDimpleLeft: 54,
  mouthDimpleRight: 55,
  mouthStretchLeft: 56,
  mouthStretchRight: 57,
  mouthRollLower: 58,
  mouthRollUpper: 59,
  mouthPressLeft: 60,
  mouthPressRight: 61,
  mouthUpperUpLeft: 62,
  mouthUpperUpRight: 63,
  mouthSmileLeft: 64,
  mouthSmileRight: 65,
  tongueOut: 66,
  eyeBlinkLeft: 67,
  eyeBlinkRight: 68,
};
