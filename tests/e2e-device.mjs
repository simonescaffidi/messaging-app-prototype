// Test end-to-end con Chromium veri: trasferimento a un nuovo dispositivo (codice) e backup completo con cronologia.
// Uso: npm i --no-save playwright && npx playwright install chromium && node tests/e2e-device.mjs
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { rmSync, writeFileSync, mkdtempSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import path from "node:path";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), ".."), PORT = 3979, base = `http://127.0.0.1:${PORT}`;
rmSync(root + "/data.json", { force: true });
const srv = spawn("node", ["server.js"], { cwd: root, env: { ...process.env, PORT: String(PORT), DATABASE_URL: "", DATA_KEY: "c".repeat(64), CODE_PEPPER: "t" }, stdio: "ignore" });
for (let i = 0; i < 50; i++) { try { if ((await fetch(base + "/health")).ok) break; } catch {} await sleep(200); }
const done = (code) => { srv.kill(); rmSync(root + "/data.json", { force: true }); process.exit(code); };
const fail = (m) => { console.error("FALLITO:", m); done(1); };
const browser = await chromium.launch();
const newPage = async () => { const c = await browser.newContext({ locale: "en-US", acceptDownloads: true }); const p = await c.newPage(); p.on("dialog", (d) => d.accept()); p.on("pageerror", (e) => console.log("pageerror", e.message)); return p; };

async function register(page, name) {
  await page.goto(base + "/app/"); await page.click('button:has-text("Sign up")');
  await page.fill("#reg-email", name + "@example.com"); await page.fill("#reg-username", name); await page.fill("#reg-password", "password-lunga-" + name);
  await page.check("#reg-terms"); await page.click("#btn-register");
  await page.waitForSelector("#credentials-modal:not(.hidden)");
  const id = (await page.textContent("#cred-publicid")).trim(); await page.click("#btn-cred-ok"); return id;
}
async function login(page, name) {
  await page.goto(base + "/app/");
  await page.fill("#login-username", name); await page.fill("#login-password", "password-lunga-" + name); await page.click("#btn-login");
  await page.waitForSelector("#app-screen:not(.hidden)", { timeout: 30000 });
}
const openChat = async (page) => { await page.waitForSelector("#chat-list > *"); await page.click("#chat-list > *"); await page.waitForSelector("#message-form"); };
const has = (page, text, timeout = 20000) => page.waitForFunction((t) => [...document.querySelectorAll("#messages .bubble")].some((b) => b.textContent.includes(t)), text, { timeout });
const say = async (page, text) => { await page.fill("#message-input", text); await page.press("#message-input", "Enter"); await has(page, text, 15000); };
const suiteTab = async (page, name) => { await page.click("#btn-suite"); await page.click(`#suite-tabs button:has-text("${name}")`); };

// --- preparazione: Alice e Bobby chattano
const pa = await newPage(), pb = await newPage();
const idB = await register(pb, "bobby"); await register(pa, "alice");
await login(pa, "alice"); await login(pb, "bobby"); await sleep(1500);
await pa.click("#btn-add-contact"); await pa.fill("#add-contact-publicid", idB); await pa.click("#btn-add-contact-confirm");
await openChat(pa); await say(pa, "storico 1 di alice"); await say(pa, "storico 2 di alice");
await openChat(pb); await has(pb, "storico 2 di alice"); await say(pb, "storico 3 di bobby"); await has(pa, "storico 3 di bobby");
console.log("conversazione iniziale ok");

// --- 1) trasferimento live: nuovo dispositivo = nuovo contesto
await suiteTab(pa, "New device"); await pa.click('button:has-text("Prepare transfer")');
await pa.waitForSelector("#suite-body textarea"); const code = (await pa.inputValue("#suite-body textarea")).trim();
if (!/^[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{40,}$/.test(code)) fail("codice non valido: " + code);
const pa2 = await newPage(); await login(pa2, "alice");
await suiteTab(pa2, "New device"); await pa2.fill('#suite-body input[placeholder="Transfer code"]', code); await pa2.click('#suite-body button:has-text("Import")');
await pa2.waitForFunction(() => document.querySelector("#suite-body")?.textContent.includes("Done: identity and chats"), null, { timeout: 30000 });
await pa2.click("#suite-close"); await openChat(pa2);
await has(pa2, "storico 1 di alice"); await has(pa2, "storico 3 di bobby");
// il vecchio dispositivo si cancella da solo e torna al login
await pa.waitForSelector("#auth-screen:not(.hidden)", { timeout: 20000 });
await say(pb, "dopo il trasferimento"); await has(pa2, "dopo il trasferimento");
await say(pa2, "scrivo dal nuovo telefono"); await has(pb, "scrivo dal nuovo telefono");
console.log("trasferimento live ok");

// --- 2) backup completo: nuovo dispositivo ancora, ripristino da file
await suiteTab(pa2, "New device");
await pa2.fill('#suite-body input[type="password"]', "frase-segreta-molto-lunga");
const [dl] = await Promise.all([pa2.waitForEvent("download"), pa2.click('#suite-body button:has-text("Save full backup")')]);
const file = path.join(mkdtempSync(path.join(tmpdir(), "sm-")), "b.securmy-full"); await dl.saveAs(file);
await pa2.click("#suite-close");
const pa3 = await newPage(); await login(pa3, "alice");
await suiteTab(pa3, "New device"); await pa3.fill('#suite-body input[type="password"]', "frase-sbagliata-lunga");
await pa3.setInputFiles('#suite-body input[type="file"]', file);
await pa3.waitForFunction(() => document.querySelector("#suite-body")?.textContent.includes("Wrong passphrase"), null, { timeout: 20000 });
await pa3.fill('#suite-body input[type="password"]', "frase-segreta-molto-lunga");
await pa3.setInputFiles('#suite-body input[type="file"]', file);
await pa3.waitForFunction(() => document.querySelector("#suite-body")?.textContent.includes("Backup restored"), null, { timeout: 30000 });
await pa3.click("#suite-close"); await openChat(pa3);
await has(pa3, "storico 1 di alice"); await has(pa3, "scrivo dal nuovo telefono");
// i contatti sono stati avvisati con un messaggio nascosto: Bobby scrive, il ripristinato legge e risponde
await openChat(pb);
await say(pb, "dopo il ripristino"); await has(pa3, "dopo il ripristino");
await say(pa3, "sono tornata dal backup"); await has(pb, "sono tornata dal backup");
const hidden = await pb.evaluate(() => [...document.querySelectorAll("#messages .bubble")].some((b) => b.textContent.includes("REKEY")));
if (hidden) fail("il messaggio tecnico e' visibile");
console.log("OK e2e dispositivo");
await browser.close(); done(0);
