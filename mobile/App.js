import React, { useCallback, useRef, useState } from "react";
import { BackHandler, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as LocalAuthentication from "expo-local-authentication";
import { WebView } from "react-native-webview";
import { APP_URL } from "./config";

// Wrapper nativo iOS/Android per la webapp "Messaggistica Privata".
// La webapp e' gia' completa (login a codice, E2E, WebAuthn, i18n in 11
// lingue): questo involucro nativo aggiunge solo
//  1) un blocco biometrico di sistema all'apertura dell'app (facoltativo,
//     usa Face ID / Touch ID / impronta tramite expo-local-authentication,
//     separato dal WebAuthn gestito dentro la webview),
//  2) la gestione del tasto "indietro" Android dentro la WebView,
//  3) una schermata di errore con "Riprova" se la rete non e' disponibile.

export default function App() {
  const [locked, setLocked] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const webviewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const tryUnlock = useCallback(async () => {
    setAuthError(null);
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !isEnrolled) {
        // Nessun Face ID/Touch ID/impronta configurato sul dispositivo:
        // si passa direttamente alla webapp, che gestisce il proprio
        // accesso tramite codice.
        setLocked(false);
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Sblocca Messaggistica Privata",
        disableDeviceFallback: false,
        cancelLabel: "Annulla"
      });
      if (result.success) {
        setLocked(false);
      } else {
        setAuthError("Sblocco annullato o non riuscito. Riprova.");
      }
    } catch (e) {
      // In caso di errore del modulo biometrico, non blocchiamo l'accesso:
      // la webapp ha comunque il proprio login a codice.
      setLocked(false);
    }
  }, []);

  React.useEffect(() => {
    tryUnlock();
  }, [tryUnlock]);

  React.useEffect(() => {
    const onBackPress = () => {
      if (canGoBack && webviewRef.current) {
        webviewRef.current.goBack();
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [canGoBack]);

  if (locked) {
    return (
      <SafeAreaView style={styles.center}>
        <StatusBar style="light" />
        <Text style={styles.title}>🔒 Messaggistica Privata</Text>
        {authError ? <Text style={styles.error}>{authError}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={tryUnlock}>
          <Text style={styles.buttonText}>Sblocca</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (loadError) {
    return (
      <SafeAreaView style={styles.center}>
        <StatusBar style="light" />
        <Text style={styles.title}>Connessione non disponibile</Text>
        <Text style={styles.error}>Controlla la connessione internet e riprova.</Text>
        <TouchableOpacity style={styles.button} onPress={() => setLoadError(false)}>
          <Text style={styles.buttonText}>Riprova</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.flex}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.flex}>
        <WebView
          ref={webviewRef}
          source={{ uri: APP_URL }}
          style={styles.flex}
          onNavigationStateChange={(nav) => setCanGoBack(nav.canGoBack)}
          onError={() => setLoadError(true)}
          onHttpError={() => setLoadError(true)}
          startInLoadingState
          domStorageEnabled
          javaScriptEnabled
          // Necessario perche' crypto.js/webauthn.js usano Web Crypto API e
          // WebAuthn, entrambi richiesti in un contesto sicuro (https).
          originWhitelist={["https://*"]}
          allowsBackForwardNavigationGestures
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#0f1115" },
  center: { flex: 1, backgroundColor: "#0f1115", alignItems: "center", justifyContent: "center", padding: 24 },
  title: { color: "#e8e9ec", fontSize: 20, fontWeight: "700", marginBottom: 16, textAlign: "center" },
  error: { color: "#e05c5c", fontSize: 13, marginBottom: 16, textAlign: "center" },
  button: { backgroundColor: "#5b8cff", paddingVertical: 12, paddingHorizontal: 28, borderRadius: 10 },
  buttonText: { color: "white", fontWeight: "700", fontSize: 15 }
});
