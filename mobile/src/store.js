import { useSyncExternalStore } from "react";

// Piccolo store globale (senza dipendenze): setState fonde i campi e avvisa i componenti.
export function createStore(initial) {
  let state = initial;
  const subs = new Set();
  return {
    get: () => state,
    set(patch) { state = { ...state, ...(typeof patch === "function" ? patch(state) : patch) }; subs.forEach((f) => f()); },
    use(selector = (s) => s) {
      return useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb); }, () => selector(state));
    },
    subscribe(f) { subs.add(f); return () => subs.delete(f); }
  };
}
export function createBus() {
  const m = new Map();
  return {
    on(ev, f) { if (!m.has(ev)) m.set(ev, new Set()); m.get(ev).add(f); return () => m.get(ev).delete(f); },
    emit(ev, d) { (m.get(ev) || []).forEach((f) => { try { f(d); } catch (e) { console.warn("bus", ev, e); } }); }
  };
}
