import React from "react";
import { Modal, Text, View } from "react-native";
import { Button, Row } from "../ui";
import { t, useLang } from "../i18n";
import { THEME as T } from "../config";
import { C, acceptCall, hangup, rejectCall, toggleCam, toggleMute } from "../calls";

// Overlay a tutto schermo per chiamate in arrivo e in corso (RTCView caricato solo quando serve).
export default function CallOverlay() {
  useLang();
  const call = C.use((s) => s.call);
  if (!call) return null;
  let RTCView = null;
  try { RTCView = require("react-native-webrtc").RTCView; } catch {}
  const ringing = call.phase === "ringing";
  return (
    <Modal visible animationType="fade" onRequestClose={() => hangup(true)}>
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        {RTCView && call.remoteUrl && call.video ? <RTCView streamURL={call.remoteUrl} style={{ flex: 1 }} objectFit="cover" /> : <View style={{ flex: 1 }} />}
        {RTCView && call.localUrl && call.video ? <RTCView streamURL={call.localUrl} mirror style={{ position: "absolute", top: 60, right: 16, width: 100, height: 140, borderRadius: 10 }} objectFit="cover" zOrder={1} /> : null}
        <View style={{ position: "absolute", top: 80, left: 0, right: 0, alignItems: "center" }}>
          <Text style={{ color: "#fff", fontSize: 26, fontWeight: "700" }}>{call.peerName}</Text>
          <Text style={{ color: T.dim, marginTop: 6 }}>{call.status}</Text>
          {call.code ? <Text style={{ color: T.ok, marginTop: 10, fontSize: 22, letterSpacing: 4 }}>{call.code}</Text> : null}
          {call.code ? <Text style={{ color: T.dim, marginTop: 4, fontSize: 12 }}>{t("callCodeHint")}</Text> : null}
        </View>
        <View style={{ position: "absolute", bottom: 50, left: 16, right: 16 }}>
          {ringing ? (
            <Row>
              <Button kind="danger" title={t("callReject")} onPress={rejectCall} style={{ flex: 1 }} />
              <Button kind="primary" title={t("callAccept")} onPress={acceptCall} style={{ flex: 1 }} />
            </Row>
          ) : (
            <Row>
              <Button title={call.muted ? "🔇" : "🎤"} onPress={toggleMute} style={{ flex: 1 }} />
              {call.video ? <Button title={call.camOff ? "🚫" : "📷"} onPress={toggleCam} style={{ flex: 1 }} /> : null}
              <Button kind="danger" title={t("callEnd")} onPress={() => hangup(true)} style={{ flex: 2 }} />
            </Row>
          )}
        </View>
      </View>
    </Modal>
  );
}
