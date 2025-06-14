import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { PassThrough } from "stream";

export async function POST(req) {
  try {
    const { text, rate = 1.0 } = await req.json();

    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env["AZURE_SPEECH_KEY"],
      process.env["AZURE_SPEECH_REGION"]
    );

    const voiceName = "en-GB-RyanNeural";
    speechConfig.speechSynthesisVoiceName = voiceName;

    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
      <voice name="${voiceName}">
        <prosody rate="0.9" pitch="-10%">
          ${text}
        </prosody>
      </voice>
    </speak>`;

    const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);
    const visemes = [];
    speechSynthesizer.visemeReceived = function (s, e) {
      visemes.push([e.audioOffset / 10000, e.visemeId]);
    };

    const audioData = await new Promise((resolve, reject) => {
      speechSynthesizer.speakSsmlAsync(
        ssml,
        (result) => {
          if (result.audioData) {
            resolve(result.audioData);
          } else {
            reject(new Error("No audio data received from Azure"));
          }
          speechSynthesizer.close();
        },
        (error) => {
          console.error("Speech synthesis error:", error);
          speechSynthesizer.close();
          reject(error);
        }
      );
    });

    const bufferStream = new PassThrough();
    bufferStream.end(Buffer.from(audioData));

    return new Response(bufferStream, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `inline; filename=tts.mp3`,
        Visemes: JSON.stringify(visemes),
      },
    });
  } catch (error) {
    console.error("Detailed error in TTS API:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        stack: error.stack,
        name: error.name,
        // Include any other relevant error details
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
