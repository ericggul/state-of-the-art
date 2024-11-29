export class AudioEffectProcessor {
  constructor() {
    this.context = null;
    this.source = null;
    this.effects = new Map();
    this.outputGain = null;
  }

  initialize(audioElement) {
    // Create new audio context if not exists
    if (!this.context) {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Create media source from audio element
    this.source = this.context.createMediaElementSource(audioElement);

    // Create main output gain
    this.outputGain = this.context.createGain();
    this.outputGain.gain.value = 1.2; // Boost volume slightly

    // Initialize default effects chain
    this.createAstronautEffect();

    // Connect the chain
    this.connectEffectChain();
  }

  createAstronautEffect() {
    // Bandpass filter
    const bandpass = this.context.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 1800;
    bandpass.Q.value = 0.5;
    this.effects.set("bandpass", bandpass);

    // Distortion
    const distortion = this.context.createWaveShaper();
    distortion.curve = this.makeDistortionCurve(50);
    this.effects.set("distortion", distortion);

    // Optional: Add more effects here
    // this.createDelayEffect();
    // this.createReverbEffect();
  }

  makeDistortionCurve(amount = 50) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    for (let i = 0; i < samples; ++i) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }

  connectEffectChain() {
    if (!this.source) return;

    // Disconnect any existing connections
    this.source.disconnect();

    // Create the effect chain
    let currentNode = this.source;

    // Connect all effects in sequence
    for (const effect of this.effects.values()) {
      currentNode.connect(effect);
      currentNode = effect;
    }

    // Connect to output gain and then to destination
    currentNode.connect(this.outputGain);
    this.outputGain.connect(this.context.destination);
  }

  cleanup() {
    if (this.context) {
      this.context.close();
      this.context = null;
    }
    this.effects.clear();
    this.source = null;
    this.outputGain = null;
  }

  // Utility method to adjust effect parameters
  updateEffect(effectName, params) {
    const effect = this.effects.get(effectName);
    if (!effect) return;

    Object.entries(params).forEach(([param, value]) => {
      if (effect[param] instanceof AudioParam) {
        effect[param].setValueAtTime(value, this.context.currentTime);
      } else {
        effect[param] = value;
      }
    });
  }
}
