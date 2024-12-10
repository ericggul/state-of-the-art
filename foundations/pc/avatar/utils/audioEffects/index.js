export class AudioEffectProcessor {
  constructor() {
    this.context = null;
    this.source = null;
    this.effects = new Map();
    this.outputGain = null;
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

  initialize(audioElement) {
    try {
      // Create new audio context if not exists
      if (!this.context) {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
      }

      // Cleanup previous source if exists
      if (this.source) {
        this.source.disconnect();
      }

      // Create media source from audio element
      this.source = this.context.createMediaElementSource(audioElement);

      // Create main output gain if not exists
      if (!this.outputGain) {
        this.outputGain = this.context.createGain();
        this.outputGain.gain.value = 1.2;
      }

      // Clear previous effects
      this.effects.clear();

      // Initialize default effects chain
      this.createAstronautEffect();

      // Connect the chain
      this.connectEffectChain();
    } catch (error) {
      console.error("Audio processor initialization error:", error);
    }
  }

  createAstronautEffect() {
    try {
      // Create effects in order
      const effectsChain = [
        {
          name: "bandpass",
          node: this.context.createBiquadFilter(),
          params: {
            type: "bandpass",
            frequency: 2300,
            Q: 1.2,
          },
        },
        {
          name: "highshelf",
          node: this.context.createBiquadFilter(),
          params: {
            type: "highshelf",
            frequency: 4000,
            gain: -20,
          },
        },
        {
          name: "lowshelf",
          node: this.context.createBiquadFilter(),
          params: {
            type: "lowshelf",
            frequency: 300,
            gain: -6,
          },
        },
        {
          name: "compressor",
          node: this.context.createDynamicsCompressor(),
          params: {
            threshold: -24,
            knee: 6,
            ratio: 16,
            attack: 0.003,
            release: 0.25,
          },
        },
        {
          name: "distortion",
          node: this.context.createWaveShaper(),
          params: {
            curve: this.makeDistortionCurve(8),
          },
        },
      ];

      // Configure and store each effect
      effectsChain.forEach(({ name, node, params }) => {
        Object.entries(params).forEach(([key, value]) => {
          if (node[key] instanceof AudioParam) {
            node[key].setValueAtTime(value, this.context.currentTime);
          } else {
            node[key] = value;
          }
        });
        this.effects.set(name, node);
      });

      // Add noise last
      this.createNoiseGenerator();
    } catch (error) {
      console.error("Error creating astronaut effect:", error);
    }
  }

  createNoiseGenerator() {
    try {
      const bufferSize = this.context.sampleRate * 2;
      const noiseBuffer = this.context.createBuffer(
        1,
        bufferSize,
        this.context.sampleRate
      );
      const output = noiseBuffer.getChannelData(0);

      // More realistic radio noise pattern
      for (let i = 0; i < bufferSize; i++) {
        // Add periodic interference patterns
        const interference = Math.sin(i * 0.01) * 0.05;
        // Add random noise
        const noise = Math.random() * 2 - 1;
        // Combine both with weighted average
        output[i] = noise * 0.7 + interference * 0.3;
      }

      const noise = this.context.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const noiseFilter = this.context.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.value = 1800;
      noiseFilter.Q.value = 0.8;

      const noiseGain = this.context.createGain();
      noiseGain.gain.value = 0.028;

      // Add noise modulation for realistic radio effect
      const noiseModulation = this.context.createOscillator();
      const modulationGain = this.context.createGain();
      noiseModulation.frequency.value = 0.3;
      modulationGain.gain.value = 0.015;
      noiseModulation.connect(modulationGain);
      modulationGain.connect(noiseGain.gain);
      noiseModulation.start();

      // Store noise nodes
      this.effects.set("noise", noise);
      this.effects.set("noiseFilter", noiseFilter);
      this.effects.set("noiseGain", noiseGain);
      this.effects.set("noiseModulation", noiseModulation);
      this.effects.set("modulationGain", modulationGain);

      // Connect noise chain separately
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.outputGain);

      // Start noise
      noise.start(0);
    } catch (error) {
      console.error("Error creating noise generator:", error);
    }
  }

  connectEffectChain() {
    try {
      if (!this.source) return;

      // Disconnect existing connections
      this.source.disconnect();

      // Get main effects in order (including distortion now)
      const mainEffects = [
        "bandpass",
        "highshelf",
        "lowshelf",
        "compressor",
        "distortion",
      ]
        .map((name) => this.effects.get(name))
        .filter(Boolean);

      // Connect main audio chain
      let currentNode = this.source;
      mainEffects.forEach((effect) => {
        currentNode.connect(effect);
        currentNode = effect;
      });

      // Connect final node to output
      currentNode.connect(this.outputGain);
      this.outputGain.connect(this.context.destination);
    } catch (error) {
      console.error("Error connecting effect chain:", error);
    }
  }

  cleanup() {
    try {
      // Stop and disconnect noise
      const noise = this.effects.get("noise");
      if (noise) {
        noise.stop();
        noise.disconnect();
      }

      // Disconnect all effects
      this.effects.forEach((effect) => {
        if (effect.disconnect) {
          effect.disconnect();
        }
      });

      // Disconnect source and output
      if (this.source) {
        this.source.disconnect();
      }
      if (this.outputGain) {
        this.outputGain.disconnect();
      }

      // Close context
      if (this.context && this.context.state !== "closed") {
        this.context.close();
      }

      // Clear references
      this.context = null;
      this.source = null;
      this.outputGain = null;
      this.effects.clear();
    } catch (error) {
      console.error("Error during cleanup:", error);
    }
  }
}
