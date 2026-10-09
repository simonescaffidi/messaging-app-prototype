import React, { useEffect, useState } from "react";
import { Linking, Text } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Bar, Button, Card, H2, Input, P, Row, Screen, ask } from "../ui";
import { t, useLang } from "../i18n";
import { THEME as T } from "../config";
import { api } from "../api";
import { storage } from "../storage";
import { S, appLockEnabled, biometricAvailable, biometricPrompt, logout, reloadMe, setAppLock } from "../session";
import { lastBackup, panicWipe } from "../vault";

export default function SecurityScreen() {
  useLang();
  const me = S.get().me || {};
  const vaultOpen = S.use((s) => s.vaultOpen);
  const [, force] = useState(0);
  const [lock, setLock] = useState(appLockEnabled());
  const [bioOk, setBioOk] = useState(false);
  const [relay, setRelay] = useState(storage.getItem("sm_relay") === "1");
  const [turn, setTurn] = useState(true);
  const [setup, setSetup] = useState(null);
  const [code, setCode] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  useEffect(() => {
    biometricAvailable().then(setBioOk);
    api("/api/ice").then((j) => setTurn(!!j.turn)).catch(() => {});
  }, []);
  const has2fa = !!(me.has2fa);
  const checks = [
    [t("chkVault"), vaultOpen],
    [t("chkEmail"), !!me.emailVerified],
    [t("chk2fa"), has2fa],
    [t("chkBio"), lock],
    [t("chkBackup"), lastBackup() > 0]
  ];
  const score = Math.round((checks.filter((c) => c[1]).length * 100) / checks.length);
  const refresh = async () => { await reloadMe(); force((n) => n + 1); };

  return (
    <Screen scroll>
      <H2 style={{ fontSize: 24 }}>{t("secTitle")}</H2>
      <Card>
        <P>{t("scoreLabel")}: {score}%</P>
        <Bar pct={score} />
        {checks.map(([l, ok]) => <P key={l} dim={!ok} ok={ok}>{ok ? "✓ " : "○ "}{l}</P>)}
      </Card>

      <Card>
        <Text style={{ color: T.text, fontWeight: "700" }}>{t("chk2fa")}</Text>
        {has2fa ? (
          <>
            <Input placeholder={t("loginPassLabel")} value={pw} onChangeText={setPw} secureTextEntry />
            <Input placeholder="123456" value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} />
            <Button kind="danger" title={t("btnDisableBiometric").split(" ")[0] === "" ? "OFF" : "OFF"} onPress={async () => {
              try { await api("/api/2fa/disable", { method: "POST", body: JSON.stringify({ password: pw, code }) }); setPw(""); setCode(""); setMsg(""); await refresh(); } catch (e) { setMsg(e.message); }
            }} />
          </>
        ) : setup ? (
          <>
            <P dim>{t("mTotpSecret")}:</P>
            <P selectable>{setup.secret}</P>
            <Button title={t("mTotpOpen")} onPress={() => Linking.openURL(setup.uri).catch(() => Clipboard.setStringAsync(setup.secret))} />
            <Button title={t("btnCopy")} onPress={() => Clipboard.setStringAsync(setup.secret)} />
            <Input placeholder="123456" value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} />
            <Button kind="primary" title={t("btnSave")} onPress={async () => {
              try { await api("/api/2fa/enable", { method: "POST", body: JSON.stringify({ code }) }); setSetup(null); setCode(""); setMsg(""); await refresh(); } catch { setMsg(t("mWrongCode")); }
            }} />
          </>
        ) : (
          <Button kind="primary" title={t("mStartSetup")} onPress={async () => { try { setSetup(await api("/api/2fa/setup", { method: "POST", body: "{}" })); setMsg(""); } catch (e) { setMsg(e.message); } }} />
        )}
        {msg ? <P error>{msg}</P> : null}
      </Card>

      <Card>
        <Text style={{ color: T.text, fontWeight: "700" }}>{t("mAppLock")}</Text>
        <P dim>{t("mAppLockHint")}</P>
        <Button kind={lock ? "primary" : undefined} disabled={!bioOk} title={lock ? "✓ " + t("btnDisableBiometric") : t("btnEnableBiometric")} onPress={async () => {
          if (!(await biometricPrompt())) return;
          setAppLock(!lock); setLock(!lock);
        }} />
      </Card>

      <Card>
        <Text style={{ color: T.text, fontWeight: "700" }}>{t("ipTitle")}</Text>
        <P dim>{t("ipHint")}</P>
        <Button kind={relay ? "primary" : undefined} title={(relay ? "✓ " : "") + t("ipLabel")} onPress={() => { const v = !relay; setRelay(v); storage.setItem("sm_relay", v ? "1" : "0"); }} />
        {!turn ? <P dim>{t("ipNoTurn")}</P> : null}
      </Card>

      <Card>
        <Text style={{ color: T.danger, fontWeight: "700" }}>{t("panicTitle")}</Text>
        <P dim>{t("panicHint")}</P>
        <Button kind="danger" title={t("panicBtn")} onPress={async () => {
          if (!(await ask(t("panicTitle"), t("panicConfirm"), "OK", t("btnCancel")))) return;
          await panicWipe(); await logout();
        }} />
      </Card>
    </Screen>
  );
}
