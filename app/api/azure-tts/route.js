import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { PassThrough } from "stream";

export async function POST(req) {
  try {
    console.log("Starting TTS process");
    const { text, rate = 1.2 } = await req.json();
    console.log("Received text:", text);

    console.log("Creating speech config");
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env["AZURE_SPEECH_KEY"],
      process.env["AZURE_SPEECH_REGION"]
    );
    console.log("Speech config created");

    const voiceName = "en-GB-SoniaNeural";
    speechConfig.speechSynthesisVoiceName = voiceName;

    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
      <voice name="${voiceName}">
        <prosody rate="${rate}">${text}</prosody>
      </voice>
    </speak>`;

    const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);
    const visemes = [];
    speechSynthesizer.visemeReceived = function (s, e) {
      visemes.push([e.audioOffset / 10000, e.visemeId]);
    };

    console.log("Starting speech synthesis");
    const audioData = await new Promise((resolve, reject) => {
      speechSynthesizer.speakSsmlAsync(
        ssml,
        (result) => {
          console.log("Speech synthesis result:", result);
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
    console.log("Speech synthesis completed");

    console.log("Audio data received, length:", audioData.byteLength);

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
      JSON.stringify({ error: error.message, stack: error.stack }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
