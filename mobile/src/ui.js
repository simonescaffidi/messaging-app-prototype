import React from "react";
import { ActivityIndicator, Alert, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { THEME as T } from "./config";

export const Screen = ({ children, style, scroll, edges }) => {
  const Body = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={[s.screen, style]} edges={edges || ["top", "left", "right"]}>
      <Body style={{ flex: 1 }} contentContainerStyle={scroll ? { padding: 16, paddingBottom: 40 } : undefined} keyboardShouldPersistTaps="handled">{children}</Body>
    </SafeAreaView>
  );
};
export const H1 = ({ children, style }) => <Text style={[s.h1, style]}>{children}</Text>;
export const H2 = ({ children, style }) => <Text style={[s.h2, style]}>{children}</Text>;
export const P = ({ children, style, dim, error, ok, selectable }) => (
  <Text selectable={selectable} style={[s.p, dim && { color: T.dim }, error && { color: T.danger }, ok && { color: T.ok }, style]}>{children}</Text>
);
export const Button = ({ title, onPress, kind, disabled, busy, style }) => (
  <Pressable
    onPress={onPress} disabled={disabled || busy}
    style={({ pressed }) => [s.btn, kind === "primary" && s.btnPrimary, kind === "danger" && s.btnDanger, (disabled || busy) && { opacity: 0.5 }, pressed && { opacity: 0.75 }, style]}
  >
    {busy ? <ActivityIndicator color="#fff" /> : <Text style={[s.btnText, kind === "primary" || kind === "danger" ? { color: "#fff" } : null]}>{title}</Text>}
  </Pressable>
);
export const Input = React.forwardRef(({ style, ...p }, ref) => (
  <TextInput ref={ref} placeholderTextColor={T.dim} autoCapitalize="none" autoCorrect={false} style={[s.input, style]} {...p} />
));
export const Card = ({ children, style }) => <View style={[s.card, style]}>{children}</View>;
export const Row = ({ children, style }) => <View style={[{ flexDirection: "row", alignItems: "center", gap: 8 }, style]}>{children}</View>;
export const Sheet = ({ visible, onClose, children, title }) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <Pressable style={s.backdrop} onPress={onClose} />
    <View style={s.sheet}>
      {title ? <H2>{title}</H2> : null}
      <ScrollView keyboardShouldPersistTaps="handled">{children}</ScrollView>
    </View>
  </Modal>
);
export const Segments = ({ items, value, onChange }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginBottom: 12 }}>
    {items.map(([id, label]) => (
      <Pressable key={id} onPress={() => onChange(id)} style={[s.seg, value === id && s.segOn]}>
        <Text style={{ color: value === id ? "#fff" : T.dim, fontWeight: "600" }}>{label}</Text>
      </Pressable>
    ))}
  </ScrollView>
);
export const Bar = ({ pct }) => (
  <View style={s.bar}><View style={[s.barFill, { width: Math.max(0, Math.min(100, pct)) + "%" }]} /></View>
);
export function ask(title, message, okLabel, cancelLabel) {
  return new Promise((res) => Alert.alert(title, message, [{ text: cancelLabel, style: "cancel", onPress: () => res(false) }, { text: okLabel, style: "destructive", onPress: () => res(true) }], { cancelable: true, onDismiss: () => res(false) }));
}
export const prompt = (title, message, cb) => {
  if (Platform.OS === "ios") Alert.prompt(title, message, cb, "secure-text");
};

export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.bg },
  h1: { color: T.text, fontSize: 26, fontWeight: "700", marginBottom: 8 },
  h2: { color: T.text, fontSize: 18, fontWeight: "700", marginVertical: 8 },
  p: { color: T.text, fontSize: 15, lineHeight: 21, marginBottom: 8 },
  btn: { backgroundColor: T.panel2, borderColor: T.border, borderWidth: 1, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16, alignItems: "center", marginVertical: 4 },
  btnPrimary: { backgroundColor: T.accent, borderColor: T.accent },
  btnDanger: { backgroundColor: T.danger, borderColor: T.danger },
  btnText: { color: T.text, fontWeight: "600", fontSize: 15 },
  input: { backgroundColor: T.panel, borderColor: T.border, borderWidth: 1, borderRadius: 10, color: T.text, paddingHorizontal: 12, paddingVertical: 11, fontSize: 16, marginVertical: 5 },
  card: { backgroundColor: T.panel, borderColor: T.border, borderWidth: 1, borderRadius: 12, padding: 12, marginVertical: 5 },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)" },
  sheet: { backgroundColor: T.panel, maxHeight: "85%", borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 16, paddingBottom: 30 },
  seg: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, backgroundColor: T.panel, marginRight: 8, borderWidth: 1, borderColor: T.border },
  segOn: { backgroundColor: T.accent, borderColor: T.accent },
  bar: { height: 8, backgroundColor: T.panel2, borderRadius: 4, overflow: "hidden", marginVertical: 6 },
  barFill: { height: 8, backgroundColor: T.accent }
});
