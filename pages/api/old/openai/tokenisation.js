import { get_encoding, encoding_for_model } from "tiktoken";

export default function handler(req, res) {
  // const encoding = get_encoding("cl100k_base");
  const encoding = encoding_for_model("gpt-4-0125-preview");
  // const encoding = get_encoding("gpt4");
  const tokens = encoding.encode(req.body.text);

  let decodedArr = [];
  tokens.forEach((token) => {
    let decoded = new TextDecoder("utf-8").decode(encoding.decode([token]));
    decodedArr.push(decoded);
  });

  encoding.free();

  res.status(200).json({ decodedArr });
}
