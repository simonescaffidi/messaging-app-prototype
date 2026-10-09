import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, H2, Input, P, Row, Sheet } from "../ui";
import { t, useLang } from "../i18n";
import { THEME as T } from "../config";
import { ONCE, S, acceptKey, burn, bus, decryptMessage, forgetPlain, hideChat, markVerified, openChat, react, reportContact, safetyNumber, sendText, setBlocked, loadChats } from "../session";
import { startCall } from "../calls";

const MODES = [["", "destructNormal"], ["30", "destruct30"], ["300", "destruct300"], ["3600", "destruct3600"], ["once", "destructOnce"]];

function Bubble({ chat, m, mine, onLongPress, onRemove, replyText }) {
  const [txt, setTxt] = useState(null);
  const [once, setOnce] = useState({ open: false, gone: false, left: 10 });
  useEffect(() => { let alive = true; decryptMessage(chat, m).then((p) => alive && setTxt(p)); return () => { alive = false; }; }, [m.id]);
  useEffect(() => {
    if (!m.selfDestructAt) return;
    const left = new Date(m.selfDestructAt).getTime() - Date.now();
    if (left <= 0 || left > 2147483000) return;
    const id = setTimeout(() => onRemove(m.id), left);
    return () => clearTimeout(id);
  }, [m.selfDestructAt]);
  useEffect(() => {
    if (!once.open || once.gone) return;
    const id = setInterval(() => setOnce((o) => (o.left <= 1 ? { ...o, gone: true, open: false } : { ...o, left: o.left - 1 })), 1000);
    return () => clearInterval(id);
  }, [once.open, once.gone]);
  useEffect(() => { if (once.gone) { const id = setTimeout(() => onRemove(m.id), 1500); return () => clearTimeout(id); } }, [once.gone]);

  const isOnce = typeof txt === "string" && txt.startsWith(ONCE);
  let body = txt == null ? "…" : txt;
  let tap = null;
  if (isOnce) {
    if (mine) body = m.burned ? t("onceSeen") : t("onceSent");
    else if (once.gone) body = t("onceGone");
    else if (once.open) body = txt.slice(ONCE.length);
    else { body = t("onceTap"); tap = async () => { setOnce({ open: true, gone: false, left: 10 }); try { await burn(m.id); } catch {} forgetPlain(m.id); }; }
  }
  return (
    <Pressable onLongPress={() => onLongPress(m, isOnce ? "" : body)} onPress={tap || undefined} style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "82%", marginVertical: 3, marginHorizontal: 10 }}>
      <View style={{ backgroundColor: mine ? T.accent : T.panel2, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8 }}>
        {replyText ? <Text numberOfLines={1} style={{ color: mine ? "#dfe3ff" : T.dim, fontSize: 12, marginBottom: 3 }}>↩ {replyText}</Text> : null}
        <Text style={{ color: tap ? "#ffd479" : "#fff", fontSize: 16 }}>{body}</Text>
        <Text style={{ color: mine ? "#dfe3ff" : T.dim, fontSize: 11, marginTop: 3, alignSelf: "flex-end" }}>
          {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{m.selfDestructAt ? " · 💣" : ""}
        </Text>
      </View>
      {m.reactions && Object.values(m.reactions).some((a) => a.length) ? (
        <Row style={{ alignSelf: mine ? "flex-end" : "flex-start", marginTop: 2 }}>
          {Object.entries(m.reactions).filter(([, a]) => a.length).map(([e, a]) => <Text key={e} style={{ color: T.text, backgroundColor: T.panel, borderRadius: 10, paddingHorizontal: 6, overflow: "hidden" }}>{e} {a.length}</Text>)}
        </Row>
      ) : null}
    </Pressable>
  );
}

export default function ChatScreen({ route, navigation }) {
  useLang();
  const { chatId } = route.params;
  const me = S.use((s) => s.me);
  const chat = S.use((s) => s.chats.find((c) => c.id === chatId));
  const status = S.use((s) => s.peerStatus[chatId]) || {};
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [mode, setMode] = useState("");
  const [reply, setReply] = useState(null);
  const [menu, setMenu] = useState(null);
  const [modeSheet, setModeSheet] = useState(false);
  const [verify, setVerify] = useState(null);
  const [more, setMore] = useState(false);
  const [reason, setReason] = useState("reportSpam");
  const [info, setInfo] = useState("");
  const [sending, setSending] = useState(false);
  const plainOf = useRef({});

  useLayoutEffect(() => {
    if (!chat) return;
    navigation.setOptions({
      title: chat.with.username,
      headerRight: () => (
        <Row>
          <Pressable onPress={() => startCall(chat, false)} hitSlop={8}><Text style={{ fontSize: 20 }}>📞</Text></Pressable>
          <Pressable onPress={() => startCall(chat, true)} hitSlop={8}><Text style={{ fontSize: 20 }}>🎥</Text></Pressable>
          <Pressable onPress={async () => setVerify(await safetyNumber(chat).catch(() => ""))} hitSlop={8}><Text style={{ fontSize: 20 }}>{status.verified ? "✅" : "🔑"}</Text></Pressable>
          <Pressable onPress={() => setMore(true)} hitSlop={8}><Text style={{ fontSize: 20, color: T.text }}>⋯</Text></Pressable>
        </Row>
      )
    });
  }, [chat && chat.with.username, status.verified, chat && chat.blockedByMe]);

  const load = useCallback(async () => { try { const list = await openChat(chatId); setMsgs(list); } catch {} }, [chatId]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const o1 = bus.on("message", (d) => { if (d.chatId === chatId && d.message.senderProfileId !== me.id) setMsgs((l) => (l.some((x) => x.id === d.message.id) ? l : [...l, d.message])); });
    const o2 = bus.on("reaction", (d) => { if (d.chatId === chatId) setMsgs((l) => l.map((x) => (x.id === d.messageId ? { ...x, reactions: d.reactions } : x))); });
    const o3 = bus.on("burn", (d) => { if (d.chatId === chatId) setMsgs((l) => l.map((x) => (x.id === d.messageId ? { ...x, burned: true, selfDestructAt: d.at } : x))); });
    return () => { o1(); o2(); o3(); };
  }, [chatId, me.id]);

  if (!chat) return null;
  const blocked = !!chat.blockedByMe;
  const byId = (id) => msgs.find((x) => x.id === id);

  async function send() {
    const v = text.trim();
    if (!v || sending) return;
    setSending(true); setInfo("");
    try {
      const m = await sendText(chat, v, mode, reply && reply.id);
      if (m) setMsgs((l) => [...l, m]);
      setText(""); setReply(null);
    } catch (e) { setInfo(e.message); }
    setSending(false);
  }
  async function doReact(m, emoji) { try { const d = await react(m.id, emoji); setMsgs((l) => l.map((x) => (x.id === m.id ? { ...x, reactions: d.reactions } : x))); } catch {} }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={["left", "right", "bottom"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
        {status.status === "changed" ? (
          <View style={{ backgroundColor: "#3a2a12", padding: 10 }}>
            <Text style={{ color: "#ffd479" }}>⚠️ {t("keyChangedBanner")}</Text>
            <Button title={t("btnAcceptKey")} onPress={() => acceptKey(chat)} />
          </View>
        ) : null}
        <FlatList
          data={[...msgs].reverse()}
          inverted
          keyExtractor={(m) => m.id}
          renderItem={({ item: m }) => (
            <Bubble chat={chat} m={m} mine={m.senderProfileId === me.id} replyText={m.replyTo && byId(m.replyTo) ? plainOf.current[m.replyTo] || "…" : null}
              onRemove={(id) => setMsgs((l) => l.filter((x) => x.id !== id))}
              onLongPress={(msg, body) => { plainOf.current[msg.id] = body.slice(0, 60); setMenu({ m: msg, body }); }} />
          )}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
        {info ? <P error style={{ paddingHorizontal: 12 }}>{info}</P> : null}
        {reply ? (
          <Row style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: T.panel }}>
            <Text numberOfLines={1} style={{ color: T.dim, flex: 1 }}>↩ {reply.body}</Text>
            <Pressable onPress={() => setReply(null)}><Text style={{ color: T.text, fontSize: 18 }}>✕</Text></Pressable>
          </Row>
        ) : null}
        <Row style={{ padding: 8, alignItems: "flex-end" }}>
          <Pressable onPress={() => setModeSheet(true)} style={{ padding: 8 }}><Text style={{ fontSize: 20 }}>{mode === "" ? "💬" : mode === "once" ? "👁" : "💣"}</Text></Pressable>
          <TextInput
            value={text} onChangeText={setText} editable={!blocked} multiline placeholder={blocked ? t("blockedNotice") : t("messagePlaceholder")} placeholderTextColor={T.dim}
            style={{ flex: 1, backgroundColor: T.panel, color: T.text, borderRadius: 18, paddingHorizontal: 14, paddingTop: 9, paddingBottom: 9, maxHeight: 120, fontSize: 16, borderWidth: 1, borderColor: T.border }}
          />
          <Pressable onPress={send} disabled={blocked || sending} style={{ padding: 10 }}><Text style={{ fontSize: 22, opacity: blocked || sending ? 0.4 : 1 }}>➤</Text></Pressable>
        </Row>
      </KeyboardAvoidingView>

      <Sheet visible={!!menu} onClose={() => setMenu(null)}>
        <Row style={{ justifyContent: "space-around", marginBottom: 8 }}>
          {["👍", "❤️", "😂", "😮"].map((e) => <Pressable key={e} onPress={() => { doReact(menu.m, e); setMenu(null); }}><Text style={{ fontSize: 30 }}>{e}</Text></Pressable>)}
        </Row>
        <Button title={t("mReply")} onPress={() => { setReply({ id: menu.m.id, body: menu.body.slice(0, 60) }); setMenu(null); }} />
        {menu && menu.body ? <Button title={t("mCopyText")} onPress={() => { Clipboard.setStringAsync(menu.body); setMenu(null); }} /> : null}
      </Sheet>

      <Sheet visible={modeSheet} onClose={() => setModeSheet(false)} title={t("destructNormal")}>
        {MODES.map(([v, k]) => <Button key={v} kind={mode === v ? "primary" : undefined} title={t(k)} onPress={() => { setMode(v); setModeSheet(false); }} />)}
        <P dim>{t("mOnceWarn")}</P>
      </Sheet>

      <Sheet visible={verify !== null} onClose={() => setVerify(null)} title={t("verifyTitle")}>
        <P dim>{t("verifyHint")}</P>
        <P selectable style={{ fontSize: 20, fontVariant: ["tabular-nums"], letterSpacing: 1 }}>{verify}</P>
        <P ok={status.verified} dim={!status.verified}>{status.verified ? "✅ " + t("verifiedBadge") : t("notVerifiedBadge")}</P>
        <Button kind="primary" title={t("btnMarkVerified")} onPress={async () => { await markVerified(chat); setVerify(null); }} />
        <Button title={t("btnClose")} onPress={() => setVerify(null)} />
      </Sheet>

      <Sheet visible={more} onClose={() => setMore(false)} title={chat.with.username}>
        <Button title={chat.hidden ? t("mUnhide") : t("mHide")} onPress={async () => { await hideChat(chat.id, !chat.hidden); await loadChats(); setMore(false); }} />
        <Button title={blocked ? t("btnUnblock") : t("btnBlock")} onPress={async () => { await setBlocked(chat.with.profileId, !blocked); await loadChats(); setMore(false); }} />
        <H2>{t("reportTitle")}</H2>
        <Row style={{ flexWrap: "wrap" }}>
          {["reportSpam", "reportAbuse", "reportIllegal", "reportOther"].map((k) => <Button key={k} kind={reason === k ? "primary" : undefined} title={t(k)} onPress={() => setReason(k)} style={{ paddingHorizontal: 10 }} />)}
        </Row>
        <Button kind="danger" title={t("btnReport")} onPress={async () => { try { await reportContact(chat.with.profileId, t(reason)); await loadChats(); Alert.alert(t("reportSent")); setMore(false); } catch (e) { Alert.alert(e.message); } }} />
      </Sheet>
    </SafeAreaView>
  );
}
