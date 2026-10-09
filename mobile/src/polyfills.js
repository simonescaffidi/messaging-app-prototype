import "fast-text-encoding";
import "./crypto-global";
import { encode, decode } from "base-64";
import { subtle } from "./subtle";
import "./storage";

const g = globalThis;
if (!g.btoa) g.btoa = encode;
if (!g.atob) g.atob = decode;
g.crypto.subtle = subtle; // le stesse primitive della Web Crypto API, compatibili col browser
