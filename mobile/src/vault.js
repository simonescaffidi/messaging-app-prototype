// Cassaforte nativa: file, note, password cifrati sul dispositivo con la chiave dati (AES-256-GCM).
// Il formato di metadati, backup (.securmy) e sync e' IDENTICO alla webapp: gli archivi si
// scambiano tra web e app.
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import E2E from "./shared/e2e";
import { S } from "./session";
import { storage } from "./storage";
import { api, authFetch } from "./api";
import { toBase64, fromBase64, utf8, fromUtf8, rid } from "./bytes";

export const MAX_FILE = 25 * 1024 * 1024; // limite prudente per la memoria del telefono
const pid = () => S.get().me.publicId;
const dir = (p = pid()) => FileSystem.documentDirectory + "vault/" + p + "/";
const itemKey = (id) => "sm_" + pid() + "_item_" + id;
const itemPrefix = () => "sm_" + pid() + "_item_";

// ------------------------------------------------------------ archivio elementi
export function allItems() {
  const out = [];
  const prefix = itemPrefix();
  for (let i = 0; i < storage.length; i++) {
    const k = storage.key(i);
    if (k && k.startsWith(prefix)) { try { out.push(JSON.parse(storage.getItem(k))); } catch {} }
  }
  return out;
}
function putItem(it) { storage.setItem(itemKey(it.id), JSON.stringify(it)); }
function rawDelete(id) { storage.removeItem(itemKey(id)); }

export async function listKind(kind) {
  const out = [];
  for (const it of allItems()) {
    if (it.kind !== kind) continue;
    try { out.push({ it, meta: await E2E.vaultOpen(it.meta) }); } catch {}
  }
  return out.sort((a, b) => (b.it.created || 0) - (a.it.created || 0));
}

async function saveItem(kind, id, meta, blobBytes) {
  await FileSystem.makeDirectoryAsync(dir(), { intermediates: true }).catch(() => {});
  if (blobBytes) await FileSystem.writeAsStringAsync(dir() + id + ".bin", toBase64(blobBytes), { encoding: FileSystem.EncodingType.Base64 });
  const now = Date.now();
  putItem({ id, kind, meta: await E2E.vaultSeal(meta), created: now, u: now, file: !!blobBytes });
}
export async function updateItem(it, meta) { putItem({ ...it, meta: await E2E.vaultSeal(meta), u: Date.now() }); }
export async function addNote(meta) { await saveItem("note", rid(), meta); }
export async function addPassword(meta) { await saveItem("pw", rid(), meta); }
export async function deleteItem(it) {
  rawDelete(it.id);
  if (it.file) await FileSystem.deleteAsync(dir() + it.id + ".bin", { idempotent: true }).catch(() => {});
  if (it.synced) authFetch("/api/sync/objects/" + it.id, { method: "DELETE" }).catch(() => {});
}

export async function addFileFromUri(uri, name, size, type) {
  if (size && size > MAX_FILE) throw new Error("fileTooBig");
  const b64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  const bytes = fromBase64(b64);
  if (bytes.length > MAX_FILE) throw new Error("fileTooBig");
  await saveItem("file", rid(), { name, size: bytes.length, type: type || "application/octet-stream" }, await E2E.sealBytes(bytes));
}
export async function pickAndAddFile() {
  const r = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true, multiple: false });
  if (r.canceled || !r.assets || !r.assets[0]) return false;
  const a = r.assets[0];
  await addFileFromUri(a.uri, a.name, a.size, a.mimeType);
  await FileSystem.deleteAsync(a.uri, { idempotent: true }).catch(() => {});
  return true;
}

async function readSealed(it) {
  const b64 = await FileSystem.readAsStringAsync(dir() + it.id + ".bin", { encoding: FileSystem.EncodingType.Base64 });
  return fromBase64(b64);
}
export async function readFileBytes(it) { return E2E.openBytes(await readSealed(it)); }

// Scrive una copia in chiaro nella cache e la passa al foglio di condivisione di sistema; poi la cancella.
export async function exportFile(it, meta) {
  const bytes = await readFileBytes(it);
  const safe = (meta.name || "file").replace(/[^\w.\- ]+/g, "_");
  const path = FileSystem.cacheDirectory + safe;
  await FileSystem.writeAsStringAsync(path, toBase64(bytes), { encoding: FileSystem.EncodingType.Base64 });
  try { if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(path, { mimeType: meta.type, dialogTitle: meta.name }); }
  finally { setTimeout(() => FileSystem.deleteAsync(path, { idempotent: true }).catch(() => {}), 60000); }
}

// ------------------------------------------------------------ backup (.securmy, come sul web)
export async function createBackup(pass) {
  if (pass.length < 10) throw new Error("backupPass");
  const items = [];
  for (const it of allItems()) {
    items.push({ id: it.id, kind: it.kind, created: it.created, meta: it.meta, blob: it.file ? toBase64(await readSealed(it)) : null });
  }
  const file = { app: "securmy-backup", v: 1, wrap: await E2E.wrapDataKey(pass), items };
  const path = FileSystem.cacheDirectory + "securmy-" + new Date().toISOString().slice(0, 10) + ".securmy";
  await FileSystem.writeAsStringAsync(path, JSON.stringify(file));
  storage.setItem("sm_" + pid() + "_backup", String(Date.now()));
  try { if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(path, { mimeType: "application/json", dialogTitle: "Securmy backup" }); }
  finally { setTimeout(() => FileSystem.deleteAsync(path, { idempotent: true }).catch(() => {}), 120000); }
}
export async function restoreBackup(pass) {
  const r = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true, multiple: false, type: "*/*" });
  if (r.canceled || !r.assets || !r.assets[0]) return -1;
  const text = await FileSystem.readAsStringAsync(r.assets[0].uri);
  await FileSystem.deleteAsync(r.assets[0].uri, { idempotent: true }).catch(() => {});
  const j = JSON.parse(text);
  if (j.app !== "securmy-backup") throw new Error("bad");
  const k = await E2E.unwrapDataKey(pass, j.wrap); // lancia se la frase e' errata
  await FileSystem.makeDirectoryAsync(dir(), { intermediates: true }).catch(() => {});
  let n = 0;
  for (const x of j.items) {
    const meta = await E2E.openWithKey(k, x.meta);
    let hasFile = false;
    if (x.blob) {
      const sealed = await E2E.sealBytes(await E2E.openBytesWith(k, fromBase64(x.blob)));
      await FileSystem.writeAsStringAsync(dir() + x.id + ".bin", toBase64(sealed), { encoding: FileSystem.EncodingType.Base64 });
      hasFile = true;
    }
    putItem({ id: x.id, kind: x.kind, meta: await E2E.vaultSeal(meta), created: x.created || Date.now(), u: Date.now(), file: hasFile });
    n++;
  }
  return n;
}
export const lastBackup = () => Number(storage.getItem("sm_" + pid() + "_backup") || 0);

// ------------------------------------------------------------ sync cifrata (a pagamento)
const u32 = (n) => { const b = new Uint8Array(4); new DataView(b.buffer).setUint32(0, n); return b; };
const concat = (...p) => { const o = new Uint8Array(p.reduce((a, x) => a + x.length, 0)); let i = 0; for (const x of p) { o.set(x, i); i += x.length; } return o; };
async function packItem(it) {
  const m = utf8(it.meta);
  return concat(u32(m.length), m, it.file ? await readSealed(it) : new Uint8Array(0));
}
function unpack(buf) {
  const n = new DataView(buf.buffer, buf.byteOffset, buf.byteLength).getUint32(0);
  return { meta: fromUtf8(buf.slice(4, 4 + n)), blob: buf.length > 4 + n ? buf.slice(4 + n) : null };
}
export const syncKeyReady = () => storage.getItem("sm_" + pid() + "_synckey") === "1";
export const syncStatus = () => api("/api/sync/status");
export const syncList = () => api("/api/sync/objects");
export async function syncCreateKey(pass) {
  const w = await E2E.wrapDataKey(pass);
  await authFetch("/api/sync/objects/_keywrap", { method: "PUT", headers: { "Content-Type": "application/octet-stream", "x-meta": JSON.stringify({ k: "wrap" }) }, body: utf8(JSON.stringify(w)) });
  storage.setItem("sm_" + pid() + "_synckey", "1");
}
export async function syncJoin(pass) {
  if (allItems().length) throw new Error("syncJoinBlock");
  const w = JSON.parse(await (await authFetch("/api/sync/objects/_keywrap")).text());
  await E2E.adoptDataKey(pass, w);
  storage.setItem("sm_" + pid() + "_synckey", "1");
}
export async function syncNow() {
  const remote = await syncList();
  const rmap = new Map(remote.filter((x) => x.id !== "_keywrap").map((x) => { let m = {}; try { m = JSON.parse(x.meta); } catch {} return [x.id, { ...x, ...m }]; }));
  const local = allItems();
  let up = 0, down = 0, del = 0;
  for (const it of local) {
    const r = rmap.get(it.id);
    const lu = it.u || it.created || 0;
    if (!r) {
      if (it.synced) { rawDelete(it.id); if (it.file) await FileSystem.deleteAsync(dir() + it.id + ".bin", { idempotent: true }).catch(() => {}); del++; continue; }
    } else {
      const ru = r.u || 0;
      if (ru > lu) continue;
      if (ru === lu && it.synced) continue;
    }
    await authFetch("/api/sync/objects/" + it.id, { method: "PUT", headers: { "Content-Type": "application/octet-stream", "x-meta": JSON.stringify({ k: it.kind, c: it.created, u: lu }) }, body: await packItem(it) });
    putItem({ ...it, synced: true, u: lu }); up++;
  }
  const lmap = new Map(local.map((x) => [x.id, x]));
  await FileSystem.makeDirectoryAsync(dir(), { intermediates: true }).catch(() => {});
  for (const [id, r] of rmap) {
    const it = lmap.get(id);
    if (it && (it.u || it.created || 0) >= (r.u || 0)) continue;
    const buf = new Uint8Array(await (await authFetch("/api/sync/objects/" + id)).arrayBuffer());
    const p = unpack(buf);
    if (p.blob) await FileSystem.writeAsStringAsync(dir() + id + ".bin", toBase64(p.blob), { encoding: FileSystem.EncodingType.Base64 });
    putItem({ id, kind: r.k, meta: p.meta, created: r.c || Date.now(), u: r.u || r.c || 0, synced: true, file: !!p.blob }); down++;
  }
  storage.setItem("sm_" + pid() + "_syncat", String(Date.now()));
  return { up, down, del };
}
export const checkoutSync = (plan) => api("/api/sync/checkout", { method: "POST", body: JSON.stringify({ plan }) });
export const syncPortal = () => api("/api/sync/portal", { method: "POST", body: "{}" });

// ------------------------------------------------------------ cancellazione di emergenza
export async function wipeVaultFiles(publicId) {
  await FileSystem.deleteAsync(dir(publicId), { idempotent: true }).catch(() => {});
}
export async function panicWipe() {
  const p = pid();
  const keys = [];
  for (let i = 0; i < storage.length; i++) { const k = storage.key(i); if (k && (k.includes(p))) keys.push(k); }
  E2E.wipeLocal(p);
  for (const k of keys) storage.removeItem(k);
  await wipeVaultFiles(p);
}
