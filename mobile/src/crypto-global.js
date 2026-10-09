// Deve essere valutato PRIMA delle librerie "noble", che leggono globalThis.crypto all'import.
import * as ExpoCrypto from "expo-crypto";
const g = globalThis;
if (!g.crypto) g.crypto = {};
if (!g.crypto.getRandomValues) g.crypto.getRandomValues = (arr) => ExpoCrypto.getRandomValues(arr);
