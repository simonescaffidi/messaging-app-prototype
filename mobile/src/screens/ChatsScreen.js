import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { Button, H1, Input, P, Row, Screen, Sheet } from "../ui";
import { t, useLang } from "../i18n";
import { THEME as T } from "../config";
import { ONCE, S, addContact, bus, decryptMessage, loadChats } from "../session";

function Preview({ chat }) {
  const [txt, setTxt] = useState("");
  const last = chat.lastMessage;
  useEffect(() => {
    let alive = true;
    if (!last) { setTxt(t("chatEmpty")); return; }
    decryptMessage(chat, last).then((p) => { if (alive) setTxt(typeof p === "string" && p.startsWith(ONCE) ? t("onceSent") : p); });
    return () => { alive = false; };
  }, [last && last.id, chat.id]);
  return <Text numberOfLines={1} style={{ color: T.dim, marginTop: 2 }}>{last ? txt : "—"}</Text>;
}

export default function ChatsScreen({ navigation }) {
  useLang();
  const chats = S.use((s) => s.chats);
  const comboUnlocked = S.use((s) => s.comboUnlocked);
  const [q, setQ] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [pubId, setPubId] = useState("");
  const [err, setErr] = useState("");

  const refresh = useCallback(async (combo = q.trim()) => { try { await loadChats(combo); } catch {} }, [q]);
  useEffect(() => { const off = bus.on("entered", () => refresh()); return off; }, [refresh]);
  useEffect(() => { const id = setTimeout(() => refresh(q.trim()), 250); return () => clearTimeout(id); }, [q]);

  const filter = q.trim().toLowerCase();
  const visible = chats.filter((c) => (comboUnlocked && filter ? true : c.with.username.toLowerCase().includes(filter)));

  async function add() {
    setErr("");
    try {
      const d = await addContact(pubId.trim());
      setAdding(false); setPubId("");
      await refresh();
      navigation.navigate("Chat", { chatId: d.chatId });
    } catch (e) { setErr(e.message); }
  }

  return (
    <Screen>
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <Row style={{ justifyContent: "space-between" }}><H1>{t("mChats")}</H1><Button title="＋" onPress={() => setAdding(true)} style={{ paddingVertical: 6, paddingHorizontal: 14 }} /></Row>
        <Input placeholder={t("searchPlaceholder")} value={q} onChangeText={setQ} />
        {comboUnlocked ? <P ok>{t("comboStatus")}</P> : null}
      </View>
      <FlatList
        data={visible}
        keyExtractor={(c) => c.id}
        refreshControl={<RefreshControl refreshing={refreshing} tintColor={T.dim} onRefresh={async () => { setRefreshing(true); await refresh(); setRefreshing(false); }} />}
        ListEmptyComponent={<P dim style={{ textAlign: "center", marginTop: 40, paddingHorizontal: 24 }}>{t("mNoChats")}</P>}
        renderItem={({ item: c }) => (
          <Pressable onPress={() => navigation.navigate("Chat", { chatId: c.id })} style={({ pressed }) => ({ paddingHorizontal: 16, paddingVertical: 12, borderBottomColor: T.border, borderBottomWidth: 1, backgroundColor: pressed ? T.panel : "transparent" })}>
            <Row style={{ justifyContent: "space-between" }}>
              <Text style={{ color: T.text, fontSize: 17, fontWeight: "600" }}>{c.with.username}{c.hidden ? "  🙈" : ""}</Text>
              {c.lastMessage ? <Text style={{ color: T.dim, fontSize: 12 }}>{new Date(c.lastMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text> : null}
            </Row>
            <Preview chat={c} />
          </Pressable>
        )}
      />
      <Sheet visible={adding} onClose={() => setAdding(false)} title={t("addContactTitle")}>
        <P dim>{t("addContactPublicIdLabel")}</P>
        <Input placeholder={t("addContactPublicIdPlaceholder")} value={pubId} onChangeText={(v) => setPubId(v.toUpperCase())} autoCapitalize="characters" />
        {err ? <P error>{err}</P> : null}
        <Button kind="primary" title={t("btnConfirmAdd")} onPress={add} />
        <Button title={t("btnCancel")} onPress={() => setAdding(false)} />
      </Sheet>
    </Screen>
  );
}
