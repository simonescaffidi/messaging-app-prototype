// Sincronizzazione cifrata della cassaforte (a pagamento, a pacchetti di spazio) e TURN gestito.
// Il server conserva SOLO dati gia' cifrati nel dispositivo (AES-256-GCM): non riceve mai
// la chiave. Pagamenti: Stripe Checkout (abbonamento mensile), chiavi da variabili d'ambiente.
const crypto = require("crypto");

const GB = 1024 * 1024 * 1024;
const MAX_OBJECT = 25 * 1024 * 1024;
function plans() {
  const prices = (process.env.SYNC_PRICES || "199,499,1499").split(",").map((x) => parseInt(x, 10));
  return [
    { id: "s5", gb: 5, cents: prices[0] || 199 },
    { id: "s25", gb: 25, cents: prices[1] || 499 },
    { id: "s100", gb: 100, cents: prices[2] || 1499 }
  ];
}
const OBJ_ID = /^[A-Za-z0-9_-]{1,40}$/;

// ---------- ICE / TURN gestito ----------
let iceCache = { at: 0, servers: null };
async function managedTurn() {
  if (iceCache.servers && Date.now() - iceCache.at < 3600 * 1000) return iceCache.servers;
  let out = null;
  try {
    if (process.env.CF_TURN_KEY_ID && process.env.CF_TURN_API_TOKEN) {
      const r = await fetch("https://rtc.live.cloudflare.com/v1/turn/keys/" + encodeURIComponent(process.env.CF_TURN_KEY_ID) + "/credentials/generate-ice-servers", {
        method: "POST", headers: { Authorization: "Bearer " + process.env.CF_TURN_API_TOKEN, "Content-Type": "application/json" }, body: JSON.stringify({ ttl: 86400 })
      });
      const j = await r.json();
      const arr = Array.isArray(j.iceServers) ? j.iceServers : j.iceServers ? [j.iceServers] : [];
      out = arr.filter((s) => s.username);
    } else if (process.env.METERED_APP && process.env.METERED_API_KEY) {
      const r = await fetch("https://" + process.env.METERED_APP + ".metered.live/api/v1/turn/credentials?apiKey=" + encodeURIComponent(process.env.METERED_API_KEY));
      const j = await r.json();
      out = Array.isArray(j) ? j.filter((s) => s.username) : null;
    }
  } catch (e) { console.error("TURN gestito:", e.message); }
  if (out && out.length) iceCache = { at: Date.now(), servers: out };
  return out && out.length ? out : (iceCache.servers || []);
}
async function iceServers() {
  const servers = [{ urls: "stun:stun.l.google.com:19302" }];
  if (process.env.TURN_URL) {
    let username = process.env.TURN_USER || "", credential = process.env.TURN_PASS || "";
    if (process.env.TURN_SECRET) { // coturn "use-auth-secret": credenziali temporanee (24 h)
      username = String(Math.floor(Date.now() / 1000) + 86400);
      credential = crypto.createHmac("sha1", process.env.TURN_SECRET).update(username).digest("base64");
    }
    servers.push({ urls: process.env.TURN_URL.split(","), username, credential });
  }
  servers.push(...(await managedTurn()));
  return { servers, turn: servers.length > 1 };
}

// ---------- sync ----------
function mount(app, { requireAuth, store, rate, baseUrl, express }) {
  const q = (...a) => store.query(...a);
  let tableP = null;
  const ready = () => tableP || (tableP = store.hasPg() ? q(`CREATE TABLE IF NOT EXISTS sync_objects (
      pid TEXT NOT NULL, id TEXT NOT NULL, size BIGINT NOT NULL, meta TEXT NOT NULL DEFAULT '',
      created BIGINT NOT NULL, data BYTEA NOT NULL, PRIMARY KEY (pid, id))`).catch((e) => { tableP = null; console.error("sync table:", e.message); }) : Promise.resolve());
  const stripeOn = () => !!process.env.STRIPE_SECRET_KEY;
  const need = (req, res, next) => (store.hasPg() ? next() : res.status(503).json({ error: "sincronizzazione non disponibile su questo server" }));
  const prof = (id) => store.load().profiles.find((p) => p.id === id);
  const quotaOf = (p) => (p && p.sync && p.sync.status === "active" ? p.sync.quota || 0 : 0);
  async function used(pid) { return Number((await q("SELECT COALESCE(SUM(size),0) AS n FROM sync_objects WHERE pid=$1", [pid])).rows[0].n); }

  app.get("/api/sync/status", requireAuth, need, async (req, res) => {
    await ready();
    const p = prof(req.profileId);
    res.json({ available: true, billing: stripeOn(), quota: quotaOf(p), used: await used(req.profileId), plan: p.sync && p.sync.status === "active" ? p.sync.plan : null, plans: plans(), maxObject: MAX_OBJECT });
  });
  app.get("/api/sync/objects", requireAuth, need, async (req, res) => {
    await ready();
    const r = await q("SELECT id,size,meta,created FROM sync_objects WHERE pid=$1 ORDER BY created", [req.profileId]);
    res.json(r.rows.map((x) => ({ id: x.id, size: Number(x.size), meta: x.meta, created: Number(x.created) })));
  });
  app.put("/api/sync/objects/:id", requireAuth, need, express.raw({ type: "application/octet-stream", limit: MAX_OBJECT + 1024 }), async (req, res) => {
    await ready();
    if (!OBJ_ID.test(req.params.id) || !Buffer.isBuffer(req.body) || req.body.length > MAX_OBJECT) return res.status(400).json({ error: "oggetto non valido" });
    if (!rate("syncput:" + req.profileId, 600, 60 * 60 * 1000)) return res.status(429).json({ error: "troppe richieste" });
    const meta = String(req.headers["x-meta"] || "");
    if (meta.length > 8000) return res.status(400).json({ error: "metadati troppo grandi" });
    const quota = quotaOf(prof(req.profileId));
    const cur = await q("SELECT size FROM sync_objects WHERE pid=$1 AND id=$2", [req.profileId, req.params.id]);
    const after = (await used(req.profileId)) - (cur.rows[0] ? Number(cur.rows[0].size) : 0) + req.body.length;
    if (!quota) return res.status(402).json({ error: "serve un piano di sincronizzazione attivo" });
    if (after > quota) return res.status(413).json({ error: "spazio esaurito" });
    await q("INSERT INTO sync_objects(pid,id,size,meta,created,data) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT (pid,id) DO UPDATE SET size=$3, meta=$4, data=$6",
      [req.profileId, req.params.id, req.body.length, meta, Date.now(), req.body]);
    res.json({ ok: true });
  });
  app.get("/api/sync/objects/:id", requireAuth, need, async (req, res) => {
    await ready();
    if (!OBJ_ID.test(req.params.id)) return res.status(404).end();
    const r = await q("SELECT data FROM sync_objects WHERE pid=$1 AND id=$2", [req.profileId, req.params.id]);
    if (!r.rows[0]) return res.status(404).end();
    res.set("Content-Type", "application/octet-stream").set("Cache-Control", "no-store").send(r.rows[0].data);
  });
  app.delete("/api/sync/objects/:id", requireAuth, need, async (req, res) => {
    await ready();
    if (OBJ_ID.test(req.params.id)) await q("DELETE FROM sync_objects WHERE pid=$1 AND id=$2", [req.profileId, req.params.id]);
    res.json({ ok: true });
  });

  // ---------- Stripe (abbonamento mensile a pacchetti di spazio) ----------
  async function stripe(path, params, method) {
    const r = await fetch("https://api.stripe.com/v1" + path, {
      method: method || "POST",
      headers: { Authorization: "Bearer " + process.env.STRIPE_SECRET_KEY, "Content-Type": "application/x-www-form-urlencoded" },
      body: params ? new URLSearchParams(params).toString() : undefined
    });
    const j = await r.json();
    if (!r.ok) throw new Error((j.error && j.error.message) || "stripe");
    return j;
  }
  app.post("/api/sync/checkout", requireAuth, async (req, res) => {
    if (!stripeOn()) return res.status(503).json({ error: "pagamenti non ancora attivi" });
    const plan = plans().find((x) => x.id === req.body.plan);
    if (!plan) return res.status(400).json({ error: "piano non valido" });
    try {
      const p = prof(req.profileId);
      const s = await stripe("/checkout/sessions", {
        mode: "subscription",
        "line_items[0][quantity]": "1",
        "line_items[0][price_data][currency]": "eur",
        "line_items[0][price_data][unit_amount]": String(plan.cents),
        "line_items[0][price_data][recurring][interval]": "month",
        "line_items[0][price_data][product_data][name]": "Securmy Sync " + plan.gb + " GB",
        client_reference_id: req.profileId,
        "metadata[plan]": plan.id,
        "subscription_data[metadata][pid]": req.profileId,
        "subscription_data[metadata][plan]": plan.id,
        ...(p.sync && p.sync.customer ? { customer: p.sync.customer } : {}),
        success_url: baseUrl() + "/app/?sync=ok",
        cancel_url: baseUrl() + "/app/?sync=cancel"
      });
      res.json({ url: s.url });
    } catch (e) { console.error("checkout:", e.message); res.status(502).json({ error: "pagamento non disponibile" }); }
  });
  app.post("/api/sync/portal", requireAuth, async (req, res) => {
    const p = prof(req.profileId);
    if (!stripeOn() || !p.sync || !p.sync.customer) return res.status(400).json({ error: "nessun abbonamento" });
    try { res.json({ url: (await stripe("/billing_portal/sessions", { customer: p.sync.customer, return_url: baseUrl() + "/app/" })).url }); }
    catch (e) { res.status(502).json({ error: "portale non disponibile" }); }
  });
  function verifySig(raw, header, secret) {
    const parts = Object.fromEntries(String(header || "").split(",").map((x) => x.split("=")));
    if (!parts.t || !parts.v1) return false;
    if (Math.abs(Date.now() / 1000 - Number(parts.t)) > 600) return false;
    const exp = crypto.createHmac("sha256", secret).update(parts.t + "." + raw).digest("hex");
    const a = Buffer.from(exp), b = Buffer.from(parts.v1);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }
  app.post("/api/stripe/webhook", (req, res) => {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret || !req.rawBody || !verifySig(req.rawBody, req.headers["stripe-signature"], secret)) return res.status(400).end();
    const ev = req.body, obj = ev.data && ev.data.object;
    const db = store.load();
    const set = (pid, patch) => { const p = db.profiles.find((x) => x.id === pid); if (p) { p.sync = Object.assign(p.sync || {}, patch); store.save(db); } };
    try {
      if (ev.type === "checkout.session.completed" && obj.client_reference_id) {
        const plan = plans().find((x) => x.id === (obj.metadata && obj.metadata.plan));
        if (plan) set(obj.client_reference_id, { plan: plan.id, quota: plan.gb * GB, status: "active", customer: obj.customer, sub: obj.subscription });
      } else if (ev.type === "customer.subscription.updated" || ev.type === "customer.subscription.deleted") {
        const pid = obj.metadata && obj.metadata.pid;
        const plan = plans().find((x) => x.id === (obj.metadata && obj.metadata.plan));
        const active = ev.type !== "customer.subscription.deleted" && ["active", "trialing", "past_due"].includes(obj.status);
        if (pid && plan) set(pid, { status: active ? "active" : "ended", quota: active ? plan.gb * GB : 0 });
      }
    } catch (e) { console.error("webhook:", e.message); }
    res.json({ received: true });
  });

  return {
    async onAccountDelete(pid) {
      if (store.hasPg()) { await ready(); await q("DELETE FROM sync_objects WHERE pid=$1", [pid]).catch(() => {}); }
      const p = prof(pid);
      if (p && p.sync && p.sync.sub && stripeOn()) await stripe("/subscriptions/" + encodeURIComponent(p.sync.sub), null, "DELETE").catch(() => {});
    }
  };
}

module.exports = { mount, iceServers };
