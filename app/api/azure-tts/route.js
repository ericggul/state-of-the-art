import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { PassThrough } from "stream";

export async function POST(req) {
  const { text } = await req.json();

  console.log("11", text);
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env["AZURE_SPEECH_KEY"],
    process.env["AZURE_SPEECH_REGION"]
  );

  // https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts
  speechConfig.speechSynthesisVoiceName = `en-GB-SoniaNeural`;

  const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);
  const visemes = [];
  speechSynthesizer.visemeReceived = function (s, e) {
    visemes.push([e.audioOffset / 10000, e.visemeId]);
  };

  console.log("12", visemes);

  const audioStream = await new Promise((resolve, reject) => {
    speechSynthesizer.speakTextAsync(
      text,
      (result) => {
        const { audioData } = result;

        speechSynthesizer.close();

        // convert arrayBuffer to stream
        const bufferStream = new PassThrough();
        bufferStream.end(Buffer.from(audioData));
        resolve(bufferStream);
      },
      (error) => {
        console.log(error);
        speechSynthesizer.close();
        reject(error);
      }
    );
  });

  console.log("13", audioStream);

  const response = new Response(audioStream, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Disposition": `inline; filename=tts.mp3`,
      Visemes: JSON.stringify(visemes),
    },
  });
  // audioStream.pipe(response);
  return response;
}
