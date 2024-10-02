import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { PassThrough } from "stream";
import { TextEncoder } from "util";

export async function GET(req) {
  const { text } = await req.json();

  const speechConfig = sdk.SpeechConfig.fromSubscription(process.env["AZURE_SPEECH_KEY"], process.env["AZURE_SPEECH_REGION"]);
  speechConfig.speechSynthesisVoiceName = `en-GB-SoniaNeural`;

  const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);
  const visemes = [];

  speechSynthesizer.visemeReceived = function (s, e) {
    visemes.push([e.audioOffset / 10000, e.visemeId]);
  };

  const audioStream = await new Promise((resolve, reject) => {
    speechSynthesizer.speakTextAsync(
      text,
      (result) => {
        const { audioData } = result;
        speechSynthesizer.close();

        // Convert arrayBuffer to stream
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

  const visemeJSON = JSON.stringify(visemes);
  const visemeStream = new PassThrough();
  visemeStream.end(new TextEncoder().encode(visemeJSON)); // Convert viseme data to stream

  // Construct a multipart response
  const boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
  const responseHeaders = new Headers({
    "Content-Type": `multipart/mixed; boundary=${boundary}`,
  });

  const body = new PassThrough();
  body.write(`--${boundary}\r\n`);
  body.write("Content-Type: audio/mpeg\r\n");
  body.write('Content-Disposition: inline; filename="tts.mp3"\r\n\r\n');

  audioStream.pipe(body, { end: false });
  audioStream.on("end", () => {
    body.write(`\r\n--${boundary}\r\n`);
    body.write("Content-Type: application/json\r\n");
    body.write('Content-Disposition: inline; filename="visemes.json"\r\n\r\n');

    visemeStream.pipe(body, { end: false });
    visemeStream.on("end", () => {
      body.write(`\r\n--${boundary}--\r\n`);
      body.end();
    });
  });

  return new Response(body, {
    headers: responseHeaders,
  });
}
