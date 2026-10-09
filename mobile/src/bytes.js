// Conversioni base64 <-> byte per file grandi (a blocchi, senza stringhe giganti intermedie).
const CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const LOOK = new Uint8Array(256).fill(255);
for (let i = 0; i < CH.length; i++) LOOK[CH.charCodeAt(i)] = i;

export function toBase64(u8) {
  const parts = [];
  for (let i = 0; i < u8.length; i += 3 * 8192) {
    const end = Math.min(u8.length, i + 3 * 8192);
    let s = "";
    let j = i;
    for (; j + 2 < end; j += 3) {
      const n = (u8[j] << 16) | (u8[j + 1] << 8) | u8[j + 2];
      s += CH[(n >> 18) & 63] + CH[(n >> 12) & 63] + CH[(n >> 6) & 63] + CH[n & 63];
    }
    if (j + 1 === end) { const n = u8[j] << 16; s += CH[(n >> 18) & 63] + CH[(n >> 12) & 63] + "=="; }
    else if (j + 2 === end) { const n = (u8[j] << 16) | (u8[j + 1] << 8); s += CH[(n >> 18) & 63] + CH[(n >> 12) & 63] + CH[(n >> 6) & 63] + "="; }
    parts.push(s);
  }
  return parts.join("");
}
export function fromBase64(b64) {
  let len = b64.length;
  while (len > 0 && b64[len - 1] === "=") len--;
  const out = new Uint8Array(Math.floor((len * 3) / 4));
  let buf = 0, bits = 0, o = 0;
  for (let i = 0; i < len; i++) {
    const v = LOOK[b64.charCodeAt(i)];
    if (v === 255) continue;
    buf = (buf << 6) | v; bits += 6;
    if (bits >= 8) { bits -= 8; out[o++] = (buf >> bits) & 255; buf &= (1 << bits) - 1; }
  }
  return out.subarray(0, o);
}
export const utf8 = (s) => new TextEncoder().encode(s);
export const fromUtf8 = (u8) => new TextDecoder().decode(u8);
export const rid = () => Array.from(globalThis.crypto.getRandomValues(new Uint8Array(10)), (b) => b.toString(16).padStart(2, "0")).join("");
