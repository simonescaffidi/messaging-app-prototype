import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { THEME as T } from "./src/config";
import { t, useLang } from "./src/i18n";
import { S, boot, loginWithBiometrics } from "./src/session";
import { Button, H1, P, Screen } from "./src/ui";
import AuthScreen from "./src/screens/AuthScreen";
import ChatsScreen from "./src/screens/ChatsScreen";
import ChatScreen from "./src/screens/ChatScreen";
import VaultScreen from "./src/screens/VaultScreen";
import SecurityScreen from "./src/screens/SecurityScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import CallOverlay from "./src/screens/CallScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const theme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: T.bg, card: T.panel, text: T.text, border: T.border, primary: T.accent } };

function Tabs() {
  useLang();
  const icon = (e) => () => <Text style={{ fontSize: 18 }}>{e}</Text>;
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: T.panel, borderTopColor: T.border }, tabBarActiveTintColor: T.accent }}>
      <Tab.Screen name="Chats" component={ChatsScreen} options={{ title: t("mChats"), tabBarIcon: icon("💬") }} />
      <Tab.Screen name="Vault" component={VaultScreen} options={{ title: t("mVault"), tabBarIcon: icon("🗄️") }} />
      <Tab.Screen name="Security" component={SecurityScreen} options={{ title: t("mSecurity"), tabBarIcon: icon("🛡️") }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: t("mSettings"), tabBarIcon: icon("⚙️") }} />
    </Tab.Navigator>
  );
}

function LockScreen() {
  useLang();
  const [err, setErr] = useState("");
  const unlock = async () => {
    const r = await loginWithBiometrics();
    if (r !== "ok") { setErr(String(r)); if (r === "fail") S.set({ appLocked: false, savedLogin: false }); }
  };
  useEffect(() => { unlock(); }, []);
  return (
    <Screen style={{ justifyContent: "center", padding: 24 }}>
      <H1 style={{ textAlign: "center" }}>🔒 {t("mLockTitle")}</H1>
      <Button kind="primary" title={t("mUnlockBio")} onPress={unlock} />
      <Button title={t("mUsePassword")} onPress={() => S.set({ appLocked: false })} />
      {err && err !== "fail" ? <P error>{err}</P> : null}
    </Screen>
  );
}

export default function App() {
  const ready = S.use((s) => s.ready);
  const token = S.use((s) => s.token);
  const locked = S.use((s) => s.appLocked);
  useEffect(() => { boot(); }, []);
  if (!ready) return <View style={{ flex: 1, backgroundColor: T.bg, justifyContent: "center" }}><ActivityIndicator color={T.accent} /></View>;
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {locked && !token ? <LockScreen /> : (
        <NavigationContainer theme={theme}>
          <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: T.panel }, headerTintColor: T.text }}>
            {token ? (
              <>
                <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
                <Stack.Screen name="Chat" component={ChatScreen} options={{ title: "" }} />
              </>
            ) : <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />}
          </Stack.Navigator>
          {token ? <CallOverlay /> : null}
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
}
