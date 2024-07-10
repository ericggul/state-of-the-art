import { get_encoding } from "tiktoken";

export default function handler(req, res) {
  const encoding = get_encoding("cl100k_base");
  const tokens = encoding.encode(req.body.text);
  encoding.free();
  res.status(200).json({ tokens });
}
