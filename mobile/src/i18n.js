import { useSyncExternalStore } from "react";
import * as Localization from "expo-localization";
import data from "./dicts.json";
import { storage } from "./storage";

const { dicts, langs, names } = data;
export const LANGS = langs;
export const LANG_NAMES = names;
let current = "it";
const subs = new Set();

export function initLang() {
  const saved = storage.getItem("app_lang");
  if (saved && dicts[saved]) { current = saved; return; }
  let code = "it";
  try { code = (Localization.getLocales()[0].languageCode || "it").toLowerCase(); } catch {}
  current = dicts[code] ? code : "en";
}
export function setLang(l) {
  if (!dicts[l]) return;
  current = l; storage.setItem("app_lang", l);
  subs.forEach((f) => f());
}
export const getLang = () => current;
export function t(key, vars) {
  let s = (dicts[current] && dicts[current][key]) || dicts.it[key] || key;
  if (vars) for (const k in vars) s = s.split("{" + k + "}").join(String(vars[k]));
  return s;
}
// Hook: ri-renderizza i componenti quando cambia la lingua.
export function useLang() {
  return useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb); }, () => current);
}
