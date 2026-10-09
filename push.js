// Notifiche push per le app native (via servizio Expo). Per privacy il server NON conosce il
// testo dei messaggi (sono cifrati) e non lo manda a Apple/Google/Expo: la notifica dice solo
// "Nuovo messaggio", senza mittente. Le chat nascoste non generano mai notifiche.
const EXPO_URL = "https://exp.host/--/api/v2/push/send";
const TOKEN_RE = /^Expo(nent)?PushToken\[[A-Za-z0-9_-]{10,60}\]$/;

function mount(app, { requireAuth, store }) {
  app.post("/api/push/register", requireAuth, (req, res) => {
    const token = String(req.body.token || "");
    if (!TOKEN_RE.test(token)) return res.status(400).json({ error: "token non valido" });
    const db = store.load();
    // un token appartiene a un solo profilo
    for (const p of db.profiles) if (p.pushTokens && p.id !== req.profileId) p.pushTokens = p.pushTokens.filter((t) => t !== token);
    const me = db.profiles.find((p) => p.id === req.profileId);
    me.pushTokens = [token, ...(me.pushTokens || []).filter((t) => t !== token)].slice(0, 5);
    store.save(db);
    res.json({ ok: true });
  });
  app.post("/api/push/unregister", requireAuth, (req, res) => {
    const token = String(req.body.token || "");
    const db = store.load();
    const me = db.profiles.find((p) => p.id === req.profileId);
    if (me && me.pushTokens) { me.pushTokens = me.pushTokens.filter((t) => t !== token); store.save(db); }
    res.json({ ok: true });
  });
}

// Chiamata dopo l'invio di un messaggio: avvisa il destinatario se non e' connesso.
function notifyMessage({ db, chat, recipientId, isOnline, store }) {
  try {
    if (isOnline(recipientId)) return;
    if (chat.hiddenFor && chat.hiddenFor[recipientId]) return;
    const p = db.profiles.find((x) => x.id === recipientId);
    if (!p || !p.pushTokens || !p.pushTokens.length) return;
    if ((p.settings && p.settings.notifications) === "off") return;
    const contact = db.contacts.find((c) => c.profileId === recipientId && c.contactProfileId !== recipientId && chat.memberIds.includes(c.contactProfileId));
    if (contact && contact.muted) return;
    const messages = p.pushTokens.map((to) => ({ to, sound: "default", title: "Securmy", body: "Nuovo messaggio", priority: "high", channelId: "messages", data: { t: "msg" } }));
    fetch(EXPO_URL, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(messages) })
      .then((r) => r.json())
      .then((j) => {
        // rimuove i token non piu' validi
        const bad = new Set();
        (j.data || []).forEach((d, i) => { if (d.status === "error" && d.details && d.details.error === "DeviceNotRegistered") bad.add(p.pushTokens[i]); });
        if (bad.size) { p.pushTokens = p.pushTokens.filter((t) => !bad.has(t)); store.save(db); }
      }).catch(() => {});
  } catch (e) { console.error("push:", e.message); }
}

module.exports = { mount, notifyMessage };
