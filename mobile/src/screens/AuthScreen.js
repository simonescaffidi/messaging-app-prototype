import React, { useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, Linking, Platform, Pressable, Switch, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Button, Card, H1, H2, Input, P, Row, Screen, Segments } from "../ui";
import { t, useLang, LANGS, LANG_NAMES, setLang, getLang } from "../i18n";
import { api } from "../api";
import { ORIGIN, THEME as T } from "../config";
import { S, biometricAvailable, login, loginWithBiometrics } from "../session";

const legalUrl = (page) => ORIGIN + (getLang() === "it" ? "" : "/" + getLang()) + "/" + page;

export default function AuthScreen() {
  useLang();
  const saved = S.use((s) => s.savedLogin);
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [need2fa, setNeed2fa] = useState(false);
  const [remember, setRemember] = useState(true);
  const [bioOk, setBioOk] = useState(false);
  const [email, setEmail] = useState("");
  const [cover, setCover] = useState(false);
  const [terms, setTerms] = useState(false);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [creds, setCreds] = useState(null);
  useEffect(() => { biometricAvailable().then(setBioOk); }, []);

  async function doLogin() {
    setMsg(""); setBusy(true);
    try {
      const r = await login(username.trim(), password, totp.trim(), remember && bioOk);
      if (r === "need2fa") { setNeed2fa(true); setMsg(t("tfaNeeded")); }
    } catch (e) { setMsg(e.message && /tentativi|verifica/.test(e.message) ? e.message : t("loginError")); }
    setBusy(false);
  }
  async function doBio() {
    setMsg(""); setBusy(true);
    const r = await loginWithBiometrics();
    if (r !== "ok") setMsg(r === "need2fa" ? t("tfaNeeded") : t("loginError"));
    setBusy(false);
  }
  async function doRegister() {
    setMsg("");
    if (!terms) return setMsg(t("termsRequired"));
    if (!email.trim() || !username.trim() || password.length < 8) return setMsg(t("regEmailLabel") + " / " + t("regUsernameLabel") + " / " + t("regPasswordLabel") + " (min. 8)");
    setBusy(true);
    try {
      const d = await api("/api/register", { method: "POST", body: JSON.stringify({ email: email.trim(), username: username.trim(), password, isCover: cover, acceptTerms: true }) });
      setCreds(d);
    } catch (e) { setMsg(e.message); }
    setBusy(false);
  }
  async function doForgot() {
    setBusy(true);
    try { await api("/api/password/forgot", { method: "POST", body: JSON.stringify({ email: email.trim(), username: username.trim() }) }); } catch {}
    setMsg(t("forgotSent")); setBusy(false);
  }

  if (creds) {
    return (
      <Screen scroll>
        <H1>{t("credModalTitle")}</H1>
        <P dim>{t("credModalText")}</P>
        <Card>
          <P dim>{t("credPublicIdLabel")}</P>
          <Pressable onPress={() => Clipboard.setStringAsync(creds.publicId)}><Text selectable style={{ color: T.text, fontSize: 22, fontWeight: "700" }}>{creds.publicId}</Text></Pressable>
          {creds.secretCombo ? (<><P dim style={{ marginTop: 10 }}>{t("credComboLabel")}</P><Text selectable style={{ color: T.text, fontSize: 22, fontWeight: "700" }}>{creds.secretCombo}</Text></>) : null}
        </Card>
        <Button kind="primary" title={t("btnCredOk")} onPress={() => { setCreds(null); setPassword(""); setMode("login"); }} />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={{ alignItems: "center", marginVertical: 12 }}>
          <Image source={require("../../assets/icon.png")} style={{ width: 84, height: 84, borderRadius: 20 }} />
          <H1 style={{ marginTop: 8 }}>{t("appTitle")}</H1>
        </View>
        <Segments items={[["login", t("tabLogin")], ["register", t("tabRegister")]]} value={mode === "forgot" ? "login" : mode} onChange={(m) => { setMode(m); setMsg(""); }} />

        {mode === "forgot" ? (
          <>
            <H2>{t("forgotTitle")}</H2>
            <Input placeholder={t("regEmailLabel")} value={email} onChangeText={setEmail} keyboardType="email-address" />
            <Input placeholder={t("loginUserLabel")} value={username} onChangeText={setUsername} />
            <Button kind="primary" title={t("btnSendReset")} onPress={doForgot} busy={busy} />
            <Button title={t("btnBack")} onPress={() => { setMode("login"); setMsg(""); }} />
          </>
        ) : (
          <>
            {mode === "register" ? <Input placeholder={t("regEmailLabel")} value={email} onChangeText={setEmail} keyboardType="email-address" textContentType="emailAddress" /> : null}
            <Input placeholder={t("loginUserLabel")} value={username} onChangeText={setUsername} textContentType="username" />
            <Input placeholder={t("loginPassLabel")} value={password} onChangeText={setPassword} secureTextEntry textContentType={mode === "register" ? "newPassword" : "password"} />
            {need2fa && mode === "login" ? <Input placeholder={t("tfaCodeLabel")} value={totp} onChangeText={setTotp} keyboardType="number-pad" maxLength={6} /> : null}
            {mode === "login" && bioOk ? (
              <Row style={{ marginVertical: 6 }}><Switch value={remember} onValueChange={setRemember} /><Text style={{ color: T.dim, flex: 1 }}>{t("mRememberBio")}</Text></Row>
            ) : null}
            {mode === "register" ? (
              <>
                <Row style={{ marginVertical: 4 }}><Switch value={cover} onValueChange={setCover} /><Text style={{ color: T.dim, flex: 1 }}>{t("regCoverLabel")}</Text></Row>
                <Row style={{ marginVertical: 4 }}>
                  <Switch value={terms} onValueChange={setTerms} />
                  <Text style={{ color: T.dim, flex: 1 }}>{t("regTermsLabel")}{" "}
                    <Text style={{ color: T.accent }} onPress={() => Linking.openURL(legalUrl("terms.html"))}>{t("termsLinkText")}</Text>{" · "}
                    <Text style={{ color: T.accent }} onPress={() => Linking.openURL(legalUrl("privacy-policy.html"))}>{t("privacyLinkText")}</Text></Text>
                </Row>
              </>
            ) : null}
            <Button kind="primary" title={mode === "login" ? t("btnLogin") : t("btnRegister")} onPress={mode === "login" ? doLogin : doRegister} busy={busy} />
            {mode === "login" && saved ? <Button title={t("btnBiometricLogin")} onPress={doBio} busy={busy} /> : null}
            {mode === "login" ? <Text style={{ color: T.accent, textAlign: "center", marginTop: 10 }} onPress={() => { setMode("forgot"); setMsg(""); }}>{t("forgotLink")}</Text> : null}
          </>
        )}
        {msg ? <P error={!/^✓|inviat|sent/i.test(msg)} dim style={{ marginTop: 10 }}>{msg}</P> : null}

        <Segments items={LANGS.map((l) => [l, LANG_NAMES[l]])} value={getLang()} onChange={setLang} />
      </KeyboardAvoidingView>
    </Screen>
  );
}
