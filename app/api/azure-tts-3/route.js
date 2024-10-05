import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { PassThrough } from "stream";

export async function POST(req) {
  const { text } = await req.json();

  const speechConfig = sdk.SpeechConfig.fromSubscription(process.env["AZURE_SPEECH_KEY"], process.env["AZURE_SPEECH_REGION"]);

  speechConfig.speechSynthesisVoiceName = "en-GB-SoniaNeural";
  const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);

  const visemes = [];
  speechSynthesizer.visemeReceived = function (s, e) {
    visemes.push([e.audioOffset / 10000, e.visemeId]);
  };

  const ssml = `
  <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
         xmlns:mstts="http://www.w3.org/2001/mstts"
         xml:lang="en-GB">
    <voice name="en-GB-SoniaNeural">
      <prosody rate="1.5" pitch="+5st">
        <mstts:express-as style="angry">
          ${text
            .split(" ")
            .map((word, index) => {
              // Random glitch chance
              const glitchChance = Math.random();

              if (glitchChance > 0.8) {
                // Major glitch - voice crash
                return `
                <prosody pitch="-15st" rate="0.8">
                  ${word}
                </prosody>
                <break time="10ms"/>
              `;
              } else if (glitchChance > 0.6) {
                // Medium glitch - repetition
                return `
                ${word}<break time="30ms"/>
                <prosody pitch="+10st" rate="2">${word.slice(0, 2)}</prosody>
              `;
              } else if (glitchChance > 0.4) {
                // Minor glitch - pitch shift
                return `
                <prosody pitch="${Math.random() > 0.5 ? "+20st" : "-20st"}" rate="1.2">
                  ${word}
                </prosody>
              `;
              }

              // No glitch
              return word;
            })
            .join(" ")}
        </mstts:express-as>
      </prosody>
    </voice>
  </speak>`;

  try {
    const result = await new Promise((resolve, reject) => {
      speechSynthesizer.speakSsmlAsync(
        ssml,
        (result) => {
          speechSynthesizer.close();
          resolve(result);
        },
        (error) => {
          speechSynthesizer.close();
          reject(error);
        }
      );
    });

    // Create array buffer from audio data
    const audioData = new Uint8Array(result.audioData);

    // Return the response with headers
    return new Response(audioData, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'inline; filename="glitch-tts.mp3"',
        Visemes: JSON.stringify(visemes),
      },
    });
  } catch (error) {
    console.error("TTS Error:", error);
    return new Response(JSON.stringify({ error: "TTS generation failed" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
