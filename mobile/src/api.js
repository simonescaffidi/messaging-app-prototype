import { ORIGIN } from "./config";

export const auth = { token: null };

function withTimeout(ms) {
  const c = new AbortController();
  const id = setTimeout(() => c.abort(), ms);
  return { signal: c.signal, done: () => clearTimeout(id) };
}

// Stessa interfaccia della webapp: JSON in/out, errore con il messaggio del server.
export async function api(path, opts = {}) {
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  if (auth.token) headers.Authorization = "Bearer " + auth.token;
  const to = withTimeout(30000);
  try {
    const r = await fetch(ORIGIN + path, { ...opts, headers, signal: to.signal });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(data.error || "errore"); e.status = r.status; throw e; }
    return data;
  } finally { to.done(); }
}

// Per risposte binarie o corpi non JSON (sync cifrata, ecc.).
export async function authFetch(path, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  if (auth.token) headers.Authorization = "Bearer " + auth.token;
  const r = await fetch(ORIGIN + path, { ...opts, headers });
  if (!r.ok) { const j = await r.json().catch(() => ({})); const e = new Error(j.error || "errore"); e.status = r.status; throw e; }
  return r;
}
