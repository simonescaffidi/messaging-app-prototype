import "./src/polyfills"; // deve essere il PRIMO import: crypto.subtle, localStorage, TextEncoder
import { registerRootComponent } from "expo";
import App from "./App";
registerRootComponent(App);
