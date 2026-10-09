import React, { useState } from "react";
import { Linking, Pressable, Text } from "react-native";
import { Button, Card, H2, Input, P, Row, Screen, Segments, ask } from "../ui";
import { t, useLang, setLang, getLang, LANGS, LANG_NAMES } from "../i18n";
import { THEME as T, ORIGIN } from "../config";
import { api } from "../api";
import { S, changePassword, deleteAccount, forgetCredentials, logout, reloadMe } from "../session";

export default function SettingsScreen() {
  useLang();
  const me = S.get().me || {};
  const [mode, setMode] = useState((me.settings && me.settings.notifications) || "normal");
  const [oldP, setOldP] = useState("");
  const [newP, setNewP] = useState("");
  const [delP, setDelP] = useState("");
  const [msg, setMsg] = useState("");
  const [, force] = useState(0);
  const ok = (m) => setMsg("✓ " + m);
  const bad = (e) => setMsg(e && e.message ? e.message : "errore");
  return (
    <Screen scroll>
      <H2 style={{ fontSize: 24 }}>{t("mSettings")}</H2>
      <Card>
        <P>{t("mYourId")}: <Text selectable>{me.publicId}</Text></P>
        <P dim>{me.username}</P>
      </Card>

      <Card>
        <Text style={{ color: T.text, fontWeight: "700" }}>{t("langSelectorLabel")}</Text>
        <Segments items={LANGS.map((l) => [l, LANG_NAMES[l]])} value={getLang()} onChange={setLang} />
      </Card>

      <Card>
        <Text style={{ color: T.text, fontWeight: "700" }}>{t("notificationsLabel")}</Text>
        <Segments value={mode} onChange={async (m) => { setMode(m); try { await api("/api/settings/notifications", { method: "POST", body: JSON.stringify({ mode: m }) }); } catch (e) { bad(e); } }}
          items={[["normal", t("notifNormal")], ["no-content", t("notifNoContent")], ["alert-only", t("notifAlertOnly")], ["off", t("notifOff")]]} />
      </Card>

      {true ? (
        <Card>
          <P>{me.emailVerified ? "✓ " + t("emailVerifiedLabel") : t("emailNotVerified")}</P>
          {!me.emailVerified ? <Button title={t("btnResendVerify")} onPress={async () => { try { await api("/api/email/resend", { method: "POST", body: "{}" }); ok(t("verifySent")); } catch (e) { bad(e); } }} /> : null}
        </Card>
      ) : null}

      <Card>
        <Text style={{ color: T.text, fontWeight: "700" }}>{t("changePwTitle")}</Text>
        <Input placeholder={t("oldPasswordLabel")} value={oldP} onChangeText={setOldP} secureTextEntry />
        <Input placeholder={t("newPasswordLabel")} value={newP} onChangeText={setNewP} secureTextEntry />
        <Button title={t("btnChangePassword")} onPress={async () => {
          try { await changePassword(oldP, newP); setOldP(""); setNewP(""); ok(t("pwChanged")); } catch (e) { bad(e); }
        }} />
      </Card>

      <Card>
        <Button title={t("termsLinkText")} onPress={() => Linking.openURL(ORIGIN + "/termini.html")} />
        <Button title={t("privacyLinkText")} onPress={() => Linking.openURL(ORIGIN + "/privacy.html")} />
      </Card>

      <Card>
        <Text style={{ color: T.danger, fontWeight: "700" }}>{t("deleteAccountTitle")}</Text>
        <P dim>{t("deleteAccountHint")}</P>
        <Input placeholder={t("loginPassLabel")} value={delP} onChangeText={setDelP} secureTextEntry />
        <Button kind="danger" title={t("btnDeleteAccount")} onPress={async () => {
          if (!(await ask(t("deleteAccountTitle"), t("deleteAccountConfirm"), "OK", t("btnCancel")))) return;
          try { await deleteAccount(delP); } catch (e) { bad(e); }
        }} />
      </Card>

      <Button title={t("mLogout")} onPress={async () => { await forgetCredentials(); await logout(); }} />
      {msg ? <P ok={msg.startsWith("✓")} error={!msg.startsWith("✓")}>{msg}</P> : null}
    </Screen>
  );
}
