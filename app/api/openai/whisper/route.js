import OpenAI from "openai";
import { writeFile } from "fs/promises";
import { join } from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response("No file uploaded", { status: 400 });
    }

    // Convert the file to a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the file temporarily
    const tempFilePath = join("/tmp", `audio-${Date.now()}.webm`);
    await writeFile(tempFilePath, buffer);

    // Transcribe the audio file
    const transcription = await openai.audio.transcriptions.create({
      file: await openai.files.createAndUpload({ file: tempFilePath, purpose: "transcript" }),
      model: "whisper-1",
    });

    return Response.json({ text: transcription.text });
  } catch (error) {
    console.error("Error processing audio:", error);
    return new Response("Error processing audio", { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
