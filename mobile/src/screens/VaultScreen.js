import React, { useCallback, useEffect, useState } from "react";
import { Alert, Linking, Pressable, Share, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Bar, Button, Card, H2, Input, P, Row, Screen, Segments, ask } from "../ui";
import { t, useLang, getLang } from "../i18n";
import { THEME as T } from "../config";
import { S } from "../session";
import * as V from "../vault";
import { P as P2P, startSend, stopSend } from "../p2psend";
import { toBase64 } from "../bytes";

const fmtSize = (n) => (n > 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(n / 1024)) + " KB");
const err = (e) => (e && /^[a-zA-Z]+$/.test(e.message) && t(e.message) !== e.message ? t(e.message) : (e && e.message) || "errore");

async function copyTemp(text) {
  await Clipboard.setStringAsync(text);
  setTimeout(async () => { try { if ((await Clipboard.getStringAsync()) === text) await Clipboard.setStringAsync(""); } catch {} }, 20000);
}
function genPassword(len) {
  const pools = ["abcdefghijkmnopqrstuvwxyz", "ABCDEFGHJKLMNPQRSTUVWXYZ", "23456789", "!@#$%^&*()-_=+[]{}?"];
  const all = pools.join("");
  const rnd = (n) => { const a = new Uint32Array(1); const lim = Math.floor(0x100000000 / n) * n; do { crypto.getRandomValues(a); } while (a[0] >= lim); return a[0] % n; };
  const out = pools.map((p) => p[rnd(p.length)]);
  while (out.length < len) out.push(all[rnd(all.length)]);
  for (let i = out.length - 1; i > 0; i--) { const j = rnd(i + 1); [out[i], out[j]] = [out[j], out[i]]; }
  return out.slice(0, len).join("");
}
async function cleanPhoto(uri, mime) {
  const png = /png/i.test(mime || "");
  const r = await ImageManipulator.manipulateAsync(uri, [], { compress: 0.92, format: png ? ImageManipulator.SaveFormat.PNG : ImageManipulator.SaveFormat.JPEG });
  return { uri: r.uri, name: "photo-" + Date.now() + (png ? ".png" : ".jpg"), type: png ? "image/png" : "image/jpeg" }; // il ridisegno elimina EXIF e GPS
}
async function pickPhoto() {
  const p = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!p.granted) throw new Error("mNoCamera");
  const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, exif: false, quality: 1 });
  if (r.canceled || !r.assets[0]) return null;
  return r.assets[0];
}

// ------------------------------------------------------------------ File
function Files({ goSend }) {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => setItems(await V.listKind("file")), []);
  useEffect(() => { load(); }, [load]);
  async function run(fn) { setBusy(true); setMsg(""); try { await fn(); await load(); } catch (e) { setMsg(err(e)); } setBusy(false); }
  return (
    <>
      <P dim>{t("filesHint")}</P>
      <Button kind="primary" busy={busy} title={t("mPickFile")} onPress={() => run(() => V.pickAndAddFile())} />
      <Button busy={busy} title={t("mPhotoPick") + " (" + t("stripMeta").split("(")[0].trim().toLowerCase() + ")"} onPress={() => run(async () => {
        const a = await pickPhoto(); if (!a) return;
        const c = await cleanPhoto(a.uri, a.mimeType);
        await V.addFileFromUri(c.uri, a.fileName || c.name, a.fileSize, c.type);
      })} />
      {msg ? <P error>{msg}</P> : null}
      {!items.length ? <P dim>{t("noItems")}</P> : null}
      {items.map(({ it, meta }) => (
        <Card key={it.id}>
          <Text style={{ color: T.text, fontWeight: "600" }}>📄 {meta.name}</Text>
          <P dim>{fmtSize(meta.size)}{it.synced ? "  ☁️" : ""}</P>
          <Row style={{ flexWrap: "wrap" }}>
            <Button title={t("btnDownload")} onPress={() => run(() => V.exportFile(it, meta))} style={{ flex: 1 }} />
            <Button title={t("btnSendP2P")} onPress={() => run(async () => {
              const bytes = await V.readFileBytes(it);
              const path = FileSystem.cacheDirectory + "p2p-" + it.id;
              await FileSystem.writeAsStringAsync(path, toBase64(bytes), { encoding: FileSystem.EncodingType.Base64 });
              goSend({ uri: path, name: meta.name, size: bytes.length, type: meta.type });
            })} style={{ flex: 1 }} />
            <Button title="🗑" onPress={async () => { if (await ask(t("confirmDelete"), "", "OK", t("btnCancel"))) run(() => V.deleteItem(it)); }} />
          </Row>
        </Card>
      ))}
    </>
  );
}

// ------------------------------------------------------------------ Note
function Notes() {
  const [items, setItems] = useState([]);
  const [edit, setEdit] = useState(null); // null | {it?}
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const load = useCallback(async () => setItems(await V.listKind("note")), []);
  useEffect(() => { load(); }, [load]);
  if (edit) {
    return (
      <>
        <Input placeholder={t("noteTitle")} value={title} onChangeText={setTitle} />
        <Input placeholder={t("noteBody")} value={body} onChangeText={setBody} multiline style={{ minHeight: 160, textAlignVertical: "top" }} />
        <Button kind="primary" title={t("btnSave")} onPress={async () => {
          if (!title.trim() && !body.trim()) return;
          const meta = { title: title.trim() || "—", body };
          if (edit.it) await V.updateItem(edit.it, meta); else await V.addNote(meta);
          setEdit(null); load();
        }} />
        <Button title={t("btnCancel")} onPress={() => setEdit(null)} />
      </>
    );
  }
  return (
    <>
      <Button kind="primary" title={"＋ " + t("mAddNote")} onPress={() => { setTitle(""); setBody(""); setEdit({}); }} />
      {!items.length ? <P dim>{t("noItems")}</P> : null}
      {items.map(({ it, meta }) => (
        <Card key={it.id}>
          <Text style={{ color: T.text, fontWeight: "600" }}>📝 {meta.title}{it.synced ? "  ☁️" : ""}</Text>
          <P dim numberOfLines={3}>{meta.body}</P>
          <Row>
            <Button title={t("btnEdit")} onPress={() => { setTitle(meta.title); setBody(meta.body); setEdit({ it }); }} style={{ flex: 1 }} />
            <Button title="🗑" onPress={async () => { if (await ask(t("confirmDelete"), "", "OK", t("btnCancel"))) { await V.deleteItem(it); load(); } }} />
          </Row>
        </Card>
      ))}
    </>
  );
}

// ------------------------------------------------------------------ Password
function Passwords() {
  const [items, setItems] = useState([]);
  const [edit, setEdit] = useState(null);
  const [f, setF] = useState({ site: "", user: "", pw: "", notes: "" });
  const [len, setLen] = useState(20);
  const [shown, setShown] = useState({});
  const [copied, setCopied] = useState("");
  const load = useCallback(async () => setItems(await V.listKind("pw")), []);
  useEffect(() => { load(); }, [load]);
  const set = (k) => (v) => setF((o) => ({ ...o, [k]: v }));
  if (edit) {
    return (
      <>
        <Input placeholder={t("pwSite")} value={f.site} onChangeText={set("site")} />
        <Input placeholder={t("pwUser")} value={f.user} onChangeText={set("user")} />
        <Input placeholder={t("pwValue")} value={f.pw} onChangeText={set("pw")} />
        <Row>
          <Button title={"🎲 " + t("pwGen")} onPress={() => set("pw")(genPassword(len))} style={{ flex: 1 }} />
          <Button title="−" onPress={() => setLen((l) => Math.max(8, l - 2))} />
          <Text style={{ color: T.text, width: 28, textAlign: "center" }}>{len}</Text>
          <Button title="+" onPress={() => setLen((l) => Math.min(64, l + 2))} />
        </Row>
        <Input placeholder={t("pwNotes")} value={f.notes} onChangeText={set("notes")} multiline />
        <Button kind="primary" title={t("btnSave")} onPress={async () => {
          if (!f.site.trim() || !f.pw) return;
          const meta = { site: f.site.trim(), user: f.user.trim(), pw: f.pw, notes: f.notes.trim() };
          if (edit.it) await V.updateItem(edit.it, meta); else await V.addPassword(meta);
          setEdit(null); load();
        }} />
        <Button title={t("btnCancel")} onPress={() => setEdit(null)} />
      </>
    );
  }
  return (
    <>
      <Button kind="primary" title={"＋ " + t("mAddPw")} onPress={() => { setF({ site: "", user: "", pw: "", notes: "" }); setEdit({}); }} />
      {!items.length ? <P dim>{t("noItems")}</P> : null}
      {items.map(({ it, meta }) => (
        <Card key={it.id}>
          <Text style={{ color: T.text, fontWeight: "600" }}>🔑 {meta.site}{meta.user ? " · " + meta.user : ""}{it.synced ? "  ☁️" : ""}</Text>
          {shown[it.id] ? <P selectable>{meta.pw}</P> : null}
          {copied === it.id ? <P ok>{t("copied")}</P> : null}
          <Row style={{ flexWrap: "wrap" }}>
            <Button title={t("btnCopy")} onPress={() => { copyTemp(meta.pw); setCopied(it.id); }} style={{ flex: 1 }} />
            <Button title={shown[it.id] ? "🙈" : "👁"} onPress={() => setShown((o) => ({ ...o, [it.id]: !o[it.id] }))} />
            <Button title={t("btnEdit")} onPress={() => { setF({ site: meta.site, user: meta.user || "", pw: meta.pw, notes: meta.notes || "" }); setEdit({ it }); }} />
            <Button title="🗑" onPress={async () => { if (await ask(t("confirmDelete"), "", "OK", t("btnCancel"))) { await V.deleteItem(it); load(); } }} />
          </Row>
        </Card>
      ))}
    </>
  );
}

// ------------------------------------------------------------------ Invio P2P
function SendP2P({ pending, clearPending }) {
  const a = P2P.use((s) => s.active);
  const [min, setMin] = useState(10);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    if (pending) { startSend(pending, min).finally(() => FileSystem.deleteAsync(pending.uri, { idempotent: true }).catch(() => {})); clearPending(); }
  }, [pending]);
  if (a) {
    return (
      <>
        <P dim>{t("sendOneUse")}</P>
        <P error={a.status === "sendFail"}>{t(a.status)}{a.status === "sendProgress" ? " " + a.pct + "%" : ""}</P>
        <Bar pct={a.pct || 0} />
        {a.link ? (
          <>
            <Card><P selectable dim style={{ fontSize: 12 }}>{a.link}</P></Card>
            <Button title={t("mShareLink")} onPress={() => Share.share({ message: a.link })} />
            <Button title={t("sendCopyLink")} onPress={() => { Clipboard.setStringAsync(a.link); setMsg("✓"); }} />
          </>
        ) : null}
        <Button kind="danger" title={t("sendRevoke")} onPress={() => stopSend(true)} />
        {msg ? <P ok>{msg}</P> : null}
      </>
    );
  }
  return (
    <>
      <P dim>{t("sendHint")}</P>
      <P dim>{t("sendOneUse")}</P>
      <Row>
        <Button kind={min === 10 ? "primary" : undefined} title={t("min10")} onPress={() => setMin(10)} style={{ flex: 1 }} />
        <Button kind={min === 60 ? "primary" : undefined} title={t("min60")} onPress={() => setMin(60)} style={{ flex: 1 }} />
      </Row>
      <Button kind="primary" title={t("sendPick")} onPress={async () => {
        try {
          const r = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
          if (r.canceled || !r.assets[0]) return;
          const f = r.assets[0];
          if (f.size > 100 * 1024 * 1024) return setMsg(t("fileTooBig"));
          startSend({ uri: f.uri, name: f.name, size: f.size, type: f.mimeType }, min);
        } catch (e) { setMsg(err(e)); }
      }} />
      {msg ? <P error>{msg}</P> : null}
    </>
  );
}

// ------------------------------------------------------------------ Pulisci foto
function Clean() {
  const [msg, setMsg] = useState("");
  return (
    <>
      <P dim>{t("cleanHint")}</P>
      <Button kind="primary" title={t("cleanPick")} onPress={async () => {
        setMsg("");
        try {
          const a = await pickPhoto(); if (!a) return;
          const c = await cleanPhoto(a.uri, a.mimeType);
          setMsg("✓ " + t("mPhotoCleaned"));
          if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(c.uri, { mimeType: c.type });
        } catch (e) { setMsg(err(e)); }
      }} />
      {msg ? <P ok={msg.startsWith("✓")} error={!msg.startsWith("✓")}>{msg}</P> : null}
    </>
  );
}

// ------------------------------------------------------------------ Backup
function Backup() {
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <>
      <P dim>{t("backupHint")}</P>
      <Input placeholder={t("backupPass")} value={pass} onChangeText={setPass} secureTextEntry />
      <Button kind="primary" busy={busy} title={t("backupExport")} onPress={async () => {
        setBusy(true); setMsg("");
        try { if (pass.length < 10) throw new Error("backupPass"); await V.createBackup(pass); setMsg("✓ " + t("backupDone")); } catch (e) { setMsg(err(e)); }
        setBusy(false);
      }} />
      <Button busy={busy} title={t("backupImport")} onPress={async () => {
        setBusy(true); setMsg("");
        try { const n = await V.restoreBackup(pass); if (n >= 0) setMsg("✓ " + t("backupRestored", { n })); } catch { setMsg(t("backupBad")); }
        setBusy(false);
      }} />
      {msg ? <P ok={msg.startsWith("✓")} error={!msg.startsWith("✓")}>{msg}</P> : null}
    </>
  );
}

// ------------------------------------------------------------------ Sync
function Sync() {
  const [st, setSt] = useState(null);
  const [hasWrap, setHasWrap] = useState(false);
  const [ready, setReady] = useState(V.syncKeyReady());
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [off, setOff] = useState(false);
  const load = useCallback(async () => {
    try { const s = await V.syncStatus(); setSt(s); setHasWrap((await V.syncList()).some((x) => x.id === "_keywrap")); } catch { setOff(true); }
  }, []);
  useEffect(() => { load(); }, [load]);
  const fmtB = (n) => (n >= 1073741824 ? (n / 1073741824).toFixed(1) + " GB" : fmtSize(n));
  if (off) return <P dim>{t("syncOff")}</P>;
  if (!st) return <P dim>{t("mLoading")}</P>;
  return (
    <>
      <P dim>{t("syncIntro")}</P>
      {!st.quota ? (
        <>
          <P>{t("syncNeedPlan")}</P>
          {!st.billing ? <P dim>{t("syncPayOff")}</P> : st.plans.map((p) => (
            <Button key={p.id} kind="primary" title={t("syncPlanBuy", { gb: p.gb, price: new Intl.NumberFormat(getLang(), { style: "currency", currency: "EUR" }).format(p.cents / 100) })}
              onPress={async () => { try { Linking.openURL((await V.checkoutSync(p.id)).url); } catch (e) { setMsg(e.message); } }} />
          ))}
        </>
      ) : (
        <>
          <P>{t("syncUsage", { a: fmtB(st.used), b: fmtB(st.quota) })}</P>
          <Bar pct={(st.used * 100) / st.quota} />
          {!ready ? (
            <>
              <Input placeholder={t("syncPass")} value={pass} onChangeText={setPass} secureTextEntry />
              <Button kind="primary" busy={busy} title={t(hasWrap ? "syncJoin" : "syncCreate")} onPress={async () => {
                setBusy(true); setMsg("");
                try {
                  if (pass.length < 10) throw new Error(t("syncPass"));
                  if (hasWrap) await V.syncJoin(pass); else await V.syncCreateKey(pass);
                  setReady(true);
                } catch (e) { setMsg(e.message === "syncJoinBlock" ? t("syncJoinBlock") : t("syncBadPass")); }
                setBusy(false);
              }} />
            </>
          ) : (
            <>
              <P ok>✅ {t("syncKeyReady")}</P>
              <Button kind="primary" busy={busy} title={t("syncNow")} onPress={async () => {
                setBusy(true); setMsg("…");
                try { const r = await V.syncNow(); setMsg("✓ " + t("syncDone", r)); load(); } catch (e) { setMsg(e.status === 413 ? t("syncNoSpace") : e.message); }
                setBusy(false);
              }} />
            </>
          )}
          {st.billing ? <Button title={t("syncManage")} onPress={async () => { try { Linking.openURL((await V.syncPortal()).url); } catch (e) { setMsg(e.message); } }} /> : null}
        </>
      )}
      {msg ? <P ok={msg.startsWith("✓")} error={!msg.startsWith("✓") && msg !== "…"}>{msg}</P> : null}
    </>
  );
}

export default function VaultScreen() {
  useLang();
  const [tab, setTab] = useState("files");
  const [pending, setPending] = useState(null);
  const vaultOpen = S.use((s) => s.vaultOpen);
  const tabs = [["files", t("tabFiles")], ["notes", t("tabNotes")], ["pw", t("tabPw")], ["send", t("tabSend")], ["clean", t("tabClean")], ["sync", t("syncTab")], ["backup", t("tabBackup")]];
  return (
    <Screen scroll>
      <H2 style={{ fontSize: 24 }}>{t("suiteTitle")}</H2>
      {!vaultOpen ? <P dim>{t("vaultLockedMsg")}</P> : (
        <>
          <Segments items={tabs} value={tab} onChange={setTab} />
          {tab === "files" ? <Files goSend={(f) => { setPending(f); setTab("send"); }} /> : null}
          {tab === "notes" ? <Notes /> : null}
          {tab === "pw" ? <Passwords /> : null}
          {tab === "send" ? <SendP2P pending={pending} clearPending={() => setPending(null)} /> : null}
          {tab === "clean" ? <Clean /> : null}
          {tab === "sync" ? <Sync /> : null}
          {tab === "backup" ? <Backup /> : null}
        </>
      )}
    </Screen>
  );
}
