export class AudioEffectProcessor {
  constructor() {
    this.context = null;
    this.source = null;
    this.effects = new Map();
    this.outputGain = null;
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
            frequency: 1600,
            Q: 0.7,
          },
        },
        {
          name: "highshelf",
          node: this.context.createBiquadFilter(),
          params: {
            type: "highshelf",
            frequency: 3000,
            gain: -15,
          },
        },
        {
          name: "lowshelf",
          node: this.context.createBiquadFilter(),
          params: {
            type: "lowshelf",
            frequency: 400,
            gain: 3,
          },
        },
        {
          name: "compressor",
          node: this.context.createDynamicsCompressor(),
          params: {
            threshold: -30,
            knee: 10,
            ratio: 12,
            attack: 0.005,
            release: 0.25,
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

      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noise = this.context.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const noiseFilter = this.context.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.value = 2000;
      noiseFilter.Q.value = 0.5;

      const noiseGain = this.context.createGain();
      noiseGain.gain.value = 0.015;

      // Store noise nodes
      this.effects.set("noise", noise);
      this.effects.set("noiseFilter", noiseFilter);
      this.effects.set("noiseGain", noiseGain);

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

      // Get main effects in order (excluding noise-related effects)
      const mainEffects = ["bandpass", "highshelf", "lowshelf", "compressor"]
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
