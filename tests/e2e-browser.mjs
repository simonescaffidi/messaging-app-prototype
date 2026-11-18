// Test end-to-end con due browser Chromium veri (Playwright): registrazione, login, scambio di messaggi v3, riavvio.
// Uso: npm i --no-save playwright && npx playwright install chromium && node tests/e2e-browser.mjs
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), ".."), PORT = 3977, base = `http://127.0.0.1:${PORT}`;
rmSync(root + "/data.json", { force: true });
const srv = spawn("node", ["server.js"], { cwd: root, env: { ...process.env, PORT: String(PORT), DATABASE_URL: "", DATA_KEY: "b".repeat(64), CODE_PEPPER: "t" }, stdio: "ignore" });
for (let i = 0; i < 50; i++) { try { if ((await fetch(base + "/health")).ok) break; } catch {} await sleep(200); }
const fail = (m) => { console.error("FALLITO:", m); srv.kill(); process.exit(1); };
const browser = await chromium.launch();
const ctxs = [await browser.newContext({ locale: "en-US" }), await browser.newContext({ locale: "en-US" })];
const pages = await Promise.all(ctxs.map((c) => c.newPage()));
pages.forEach((p, i) => p.on("pageerror", (e) => console.log("pageerror", i, e.message)));

async function register(page, name) {
  await page.goto(base + "/app/"); 
  await page.click("button:has-text(\"Sign up\")");
  await page.fill("#reg-email", name + "@example.com"); await page.fill("#reg-username", name); await page.fill("#reg-password", "password-lunga-" + name);
  await page.check("#reg-terms"); await page.click("#btn-register");
  await page.waitForSelector("#credentials-modal:not(.hidden)");
  const publicId = (await page.textContent("#cred-publicid")).trim();
  await page.click("#btn-cred-ok");
  await page.fill("#login-username", name); await page.fill("#login-password", "password-lunga-" + name); await page.click("#btn-login");
  await page.waitForSelector("#app-screen:not(.hidden)", { timeout: 30000 });
  return publicId;
}
const idA = await register(pages[0], "alice");
const idB = await register(pages[1], "bobby");
console.log("registrati", idA, idB);
await sleep(1500);
// A aggiunge B
await pages[0].click("#btn-add-contact"); await pages[0].fill("#add-contact-publicid", idB); await pages[0].click("#btn-add-contact-confirm");
await pages[0].waitForSelector("#chat-list .chat-item, #chat-list li, #chat-list > *", { timeout: 10000 });
async function openFirstChat(page) { await page.waitForSelector("#chat-list > *"); await page.click("#chat-list > *"); await page.waitForSelector("#message-form"); }
async function sendMsg(page, text) { await page.fill("#message-input", text); await page.press("#message-input", "Enter"); await page.waitForFunction((t) => [...document.querySelectorAll("#messages .bubble")].some((b) => b.textContent.includes(t)), text, { timeout: 15000 }); }
async function waitText(page, text) { await page.waitForFunction((t) => [...document.querySelectorAll("#messages .bubble")].some((b) => b.textContent.includes(t)), text, { timeout: 20000 }); }

const sent = [];
pages.forEach((p) => p.on("request", (r) => { if (r.method() === "POST" && r.url().endsWith("/api/messages")) { try { sent.push(JSON.parse(r.postData())); } catch {} } }));
await openFirstChat(pages[0]);
await sendMsg(pages[0], "ciao 1 da alice");
await sendMsg(pages[0], "ciao 2 da alice");
// B: la chat compare via WebSocket; la apre e legge
await openFirstChat(pages[1]);
await waitText(pages[1], "ciao 1 da alice"); await waitText(pages[1], "ciao 2 da alice");
await sendMsg(pages[1], "risposta 1 da bobby");
await waitText(pages[0], "risposta 1 da bobby");
await sendMsg(pages[0], "ciao 3 da alice");
await waitText(pages[1], "ciao 3 da alice");
await sendMsg(pages[1], "risposta 2 da bobby"); await sendMsg(pages[1], "risposta 3 da bobby");
await waitText(pages[0], "risposta 2 da bobby"); await waitText(pages[0], "risposta 3 da bobby");
console.log("messaggi inviati:", sent.length, "versioni:", sent.map((m) => JSON.parse(m.hdr).v).join(","));
if (!sent.every((m) => JSON.parse(m.hdr).v === 3)) fail("non tutti v3");
// ricarica pagina di B: la cronologia (cache cifrata) deve restare leggibile dopo un nuovo login
await pages[1].reload(); await pages[1].fill("#login-username", "bobby"); await pages[1].fill("#login-password", "password-lunga-bobby"); await pages[1].click("#btn-login");
await pages[1].waitForSelector("#app-screen:not(.hidden)", { timeout: 20000 }); await openFirstChat(pages[1]);
await waitText(pages[1], "ciao 1 da alice"); await waitText(pages[1], "risposta 3 da bobby");
await sendMsg(pages[1], "dopo il riavvio");
await waitText(pages[0], "dopo il riavvio");
console.log("OK e2e browser");
await browser.close(); srv.kill(); rmSync(root + "/data.json", { force: true });
