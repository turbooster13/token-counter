import { getEncoding, type TiktokenEncoding } from "js-tiktoken";

const encoders = new Map<TiktokenEncoding, ReturnType<typeof getEncoding>>();

function encoderFor(encoding: TiktokenEncoding) {
  let enc = encoders.get(encoding);
  if (!enc) {
    enc = getEncoding(encoding);
    encoders.set(encoding, enc);
  }
  return enc;
}

export function exactTokenCount(text: string, encoding: "cl100k_base" | "o200k_base"): number {
  if (!text) return 0;
  return encoderFor(encoding).encode(text).length;
}

// No public exact tokenizer for these providers — ~4 chars/token holds up
// reasonably well for English prose, worse for code or other languages.
export function estimateTokenCount(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}
