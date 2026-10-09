// Notifiche push: il server manda solo "Nuovo messaggio" (mai testo o mittente).
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { api } from "./api";
import { storage } from "./storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false })
});

export async function registerPush() {
  try {
    if (!Device.isDevice) return "no-device";
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("messages", { name: "Messaggi", importance: Notifications.AndroidImportance.HIGH, lockscreenVisibility: Notifications.AndroidNotificationVisibility.PRIVATE });
    }
    let st = (await Notifications.getPermissionsAsync()).status;
    if (st !== "granted") st = (await Notifications.requestPermissionsAsync()).status;
    if (st !== "granted") return "denied";
    const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId;
    const token = (await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined)).data;
    await api("/api/push/register", { method: "POST", body: JSON.stringify({ token }) });
    storage.setItem("sm_push_token", token);
    return "ok";
  } catch (e) { return "error:" + (e.message || e); }
}
export async function unregisterPush() {
  const token = storage.getItem("sm_push_token");
  if (!token) return;
  try { await api("/api/push/unregister", { method: "POST", body: JSON.stringify({ token }) }); } catch {}
  storage.removeItem("sm_push_token");
}
