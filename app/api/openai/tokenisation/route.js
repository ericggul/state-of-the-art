import { encoding_for_model } from "tiktoken";

export async function POST(req) {
  // const encoding = get_encoding("cl100k_base");
  const encoding = encoding_for_model("gpt-4-0125-preview");
  const { text } = await req.json();
  // const encoding = get_encoding("gpt4");
  const tokens = encoding.encode(text);

  let decodedArr = [];
  tokens.forEach((token) => {
    let decoded = new TextDecoder("utf-8").decode(encoding.decode([token]));
    decodedArr.push(decoded);
  });

  encoding.free();

  return Response.json({ decodedArr });
}
