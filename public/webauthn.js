// Sblocco biometrico reale via WebAuthn (FIDO2), usando l'authenticator
// di piattaforma del dispositivo (Face ID / Touch ID / impronta Android /
// Windows Hello). Nessun dato biometrico lascia mai il dispositivo: il
// browser restituisce solo una firma crittografica verificata dal server
// con @simplewebauthn/server (vedi server.js).

const WebAuthnUnlock = (() => {
  function b64urlToBuf(b64url) {
    const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
    return Uint8Array.from(atob(b64 + pad), (c) => c.charCodeAt(0)).buffer;
  }
  function bufToB64url(buf) {
    const bytes = new Uint8Array(buf);
    let str = "";
    for (const b of bytes) str += String.fromCharCode(b);
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function isSupported() {
    return !!(window.PublicKeyCredential && navigator.credentials);
  }

  async function platformAvailable() {
    if (!isSupported()) return false;
    try {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
      return false;
    }
  }

  // Registra una nuova passkey per il profilo gia' loggato (via api() del chiamante).
  async function register(api) {
    const options = await api("/api/webauthn/register-options", { method: "POST", body: JSON.stringify({}) });
    const publicKey = {
      ...options,
      challenge: b64urlToBuf(options.challenge),
      user: { ...options.user, id: b64urlToBuf(options.user.id) },
      excludeCredentials: (options.excludeCredentials || []).map((c) => ({ ...c, id: b64urlToBuf(c.id) }))
    };
    const credential = await navigator.credentials.create({ publicKey });
    const resp = credential.response;
    const payload = {
      id: credential.id,
      rawId: bufToB64url(credential.rawId),
      type: credential.type,
      response: {
        clientDataJSON: bufToB64url(resp.clientDataJSON),
        attestationObject: bufToB64url(resp.attestationObject),
        transports: resp.getTransports ? resp.getTransports() : []
      },
      clientExtensionResults: credential.getClientExtensionResults ? credential.getClientExtensionResults() : {},
      deviceLabel: guessDeviceLabel()
    };
    return api("/api/webauthn/register-verify", { method: "POST", body: JSON.stringify(payload) });
  }

  // Login biometrico: nessun token richiesto, chiamata non autenticata.
  async function login(apiPublic) {
    const options = await apiPublic("/api/webauthn/login-options", { method: "POST", body: JSON.stringify({}) });
    const publicKey = {
      ...options,
      challenge: b64urlToBuf(options.challenge),
      allowCredentials: (options.allowCredentials || []).map((c) => ({ ...c, id: b64urlToBuf(c.id) }))
    };
    const assertion = await navigator.credentials.get({ publicKey });
    const resp = assertion.response;
    const payload = {
      id: assertion.id,
      rawId: bufToB64url(assertion.rawId),
      type: assertion.type,
      response: {
        clientDataJSON: bufToB64url(resp.clientDataJSON),
        authenticatorData: bufToB64url(resp.authenticatorData),
        signature: bufToB64url(resp.signature),
        userHandle: resp.userHandle ? bufToB64url(resp.userHandle) : null
      },
      clientExtensionResults: assertion.getClientExtensionResults ? assertion.getClientExtensionResults() : {}
    };
    return apiPublic("/api/webauthn/login-verify", { method: "POST", body: JSON.stringify(payload) });
  }

  function guessDeviceLabel() {
    const ua = navigator.userAgent;
    if (/iPhone|iPad/.test(ua)) return "iPhone/iPad";
    if (/Android/.test(ua)) return "Android";
    if (/Mac/.test(ua)) return "Mac";
    if (/Windows/.test(ua)) return "Windows";
    return "Questo dispositivo";
  }

  return { isSupported, platformAvailable, register, login };
})();
