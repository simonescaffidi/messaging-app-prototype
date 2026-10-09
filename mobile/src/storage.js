// localStorage sincrono (richiesto da crypto.js) per React Native: mappa in memoria con
// scrittura su AsyncStorage. Prima di usare l'app va chiamata hydrate().
import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "ls:";
const mem = new Map();
let keyList = null;
const keys = () => keyList || (keyList = [...mem.keys()]);

export async function hydrate() {
  const all = (await AsyncStorage.getAllKeys()).filter((k) => k.startsWith(PREFIX));
  const pairs = await AsyncStorage.multiGet(all);
  for (const [k, v] of pairs) if (v != null) mem.set(k.slice(PREFIX.length), v);
  keyList = null;
}
export const storage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => { if (!mem.has(k)) keyList = null; mem.set(k, String(v)); AsyncStorage.setItem(PREFIX + k, String(v)).catch(() => {}); },
  removeItem: (k) => { if (mem.delete(k)) keyList = null; AsyncStorage.removeItem(PREFIX + k).catch(() => {}); },
  key: (i) => keys()[i] ?? null,
  get length() { return mem.size; }
};
globalThis.localStorage = storage;
