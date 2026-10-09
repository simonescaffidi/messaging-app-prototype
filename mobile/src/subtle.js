// Implementazione minima di crypto.subtle per React Native (Hermes non ce l'ha).
// Copre SOLO cio' che usano crypto.js / p2pcore.js (stesse primitive del browser, quindi
// i messaggi sono compatibili con la webapp): PBKDF2-SHA256, HKDF-SHA256, AES-256-GCM,
// ECDH P-256, SHA-256. Basata su librerie "noble" (JavaScript puro, verificate e senza
// moduli nativi): niente da compilare e comportamento identico al browser.
import { p256 } from "@noble/curves/p256";
import { sha256 } from "@noble/hashes/sha256";
import { pbkdf2Async } from "@noble/hashes/pbkdf2";
import { hkdf } from "@noble/hashes/hkdf";
import { gcm } from "@noble/ciphers/aes";

const u8 = (d) => (d instanceof Uint8Array ? d : d instanceof ArrayBuffer ? new Uint8Array(d) : new Uint8Array(d.buffer, d.byteOffset, d.byteLength));
const toAB = (a) => a.buffer.slice(a.byteOffset, a.byteOffset + a.byteLength);
const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
function b64u(bytes) {
  let out = "", i = 0;
  for (; i + 2 < bytes.length; i += 3) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    out += B64[(n >> 18) & 63] + B64[(n >> 12) & 63] + B64[(n >> 6) & 63] + B64[n & 63];
  }
  if (i + 1 === bytes.length) { const n = bytes[i] << 16; out += B64[(n >> 18) & 63] + B64[(n >> 12) & 63]; }
  else if (i + 2 === bytes.length) { const n = (bytes[i] << 16) | (bytes[i + 1] << 8); out += B64[(n >> 18) & 63] + B64[(n >> 12) & 63] + B64[(n >> 6) & 63]; }
  return out;
}
function unb64u(s) {
  const map = {}; for (let i = 0; i < 64; i++) map[B64[i]] = i;
  const out = []; let buf = 0, bits = 0;
  for (const ch of s.replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_")) {
    buf = (buf << 6) | map[ch]; bits += 6;
    if (bits >= 8) { bits -= 8; out.push((buf >> bits) & 255); }
  }
  return Uint8Array.from(out);
}
const algName = (a) => (typeof a === "string" ? a : a.name).toUpperCase();
const key = (type, name, extractable, usages, props) => ({ type, extractable, algorithm: { name }, usages: usages || [], ...props });

export const subtle = {
  async importKey(format, data, algorithm, extractable, usages) {
    const name = algName(algorithm);
    if (format === "raw") return key("secret", name, extractable, usages, { _raw: new Uint8Array(u8(data)) });
    if (format === "jwk" && name === "ECDH") {
      const x = unb64u(data.x), y = unb64u(data.y);
      const pub = new Uint8Array(65); pub[0] = 4; pub.set(x, 1); pub.set(y, 33);
      p256.ProjectivePoint.fromHex(pub); // valida che il punto sia sulla curva
      if (data.d) return key("private", name, extractable, usages, { _d: unb64u(data.d), _pub: pub });
      return key("public", name, extractable, usages, { _pub: pub });
    }
    throw new Error("importKey non supportata: " + format + "/" + name);
  },
  async exportKey(format, k) {
    if (format !== "jwk" || k.algorithm.name !== "ECDH") throw new Error("exportKey non supportata");
    if (!k.extractable) throw new Error("chiave non esportabile");
    const jwk = { kty: "EC", crv: "P-256", x: b64u(k._pub.slice(1, 33)), y: b64u(k._pub.slice(33, 65)), ext: true };
    if (k.type === "private") { jwk.d = b64u(k._d); jwk.key_ops = ["deriveBits"]; } else jwk.key_ops = [];
    return jwk;
  },
  async generateKey(algorithm, extractable, usages) {
    if (algName(algorithm) !== "ECDH") throw new Error("generateKey non supportata");
    const d = p256.utils.randomPrivateKey();
    const pub = p256.getPublicKey(d, false);
    return { privateKey: key("private", "ECDH", extractable, usages, { _d: d, _pub: pub }), publicKey: key("public", "ECDH", true, [], { _pub: pub }) };
  },
  async deriveBits(algorithm, base, length) {
    if (algName(algorithm) !== "ECDH") throw new Error("deriveBits non supportata");
    const shared = p256.getSharedSecret(base._d, algorithm.public._pub, true).slice(1); // solo la coordinata x
    return toAB(shared.slice(0, length / 8));
  },
  async deriveKey(algorithm, base, derived, extractable, usages) {
    const name = algName(algorithm), len = (derived.length || 256) / 8;
    let raw;
    if (name === "PBKDF2") {
      if ((algorithm.hash.name || algorithm.hash).toUpperCase() !== "SHA-256") throw new Error("hash non supportato");
      raw = await pbkdf2Async(sha256, base._raw, u8(algorithm.salt), { c: algorithm.iterations, dkLen: len, asyncTick: 8 });
    } else if (name === "HKDF") {
      raw = hkdf(sha256, base._raw, u8(algorithm.salt), u8(algorithm.info), len);
    } else throw new Error("deriveKey non supportata: " + name);
    return key("secret", "AES-GCM", extractable, usages, { _raw: raw });
  },
  async encrypt(algorithm, k, data) {
    if (algName(algorithm) !== "AES-GCM") throw new Error("encrypt non supportata");
    const aad = algorithm.additionalData ? u8(algorithm.additionalData) : undefined;
    return toAB(gcm(k._raw, u8(algorithm.iv), aad).encrypt(u8(data)));
  },
  async decrypt(algorithm, k, data) {
    if (algName(algorithm) !== "AES-GCM") throw new Error("decrypt non supportata");
    const aad = algorithm.additionalData ? u8(algorithm.additionalData) : undefined;
    return toAB(gcm(k._raw, u8(algorithm.iv), aad).decrypt(u8(data)));
  },
  async digest(algorithm, data) {
    if (algName(algorithm) !== "SHA-256") throw new Error("digest non supportato");
    return toAB(sha256(u8(data)));
  }
};
