import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { PassThrough } from "stream";

export async function POST(req) {
  const { text } = await req.json();

  const speechConfig = sdk.SpeechConfig.fromSubscription(process.env["AZURE_SPEECH_KEY"], process.env["AZURE_SPEECH_REGION"]);

  // Use the desired voice
  speechConfig.speechSynthesisVoiceName = "en-GB-SoniaNeural";

  const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);

  // Construct SSML with increased volume and speed
  const ssml = `
    <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
      xmlns:mstts="http://www.w3.org/2001/mstts"
      xml:lang="en-GB">
      <voice name="en-GB-SoniaNeural">
        <prosody pitch="+1st" rate="2" volume="+300%">
          <mstts:express-as style="shouting">
            ${text}
          </mstts:express-as>
        </prosody>
      </voice>
    </speak>
  `;

  const audioStream = await new Promise((resolve, reject) => {
    speechSynthesizer.speakSsmlAsync(
      ssml,
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

  const response = new Response(audioStream, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Disposition": `inline; filename=tts.mp3`,
    },
  });

  return response;
}
