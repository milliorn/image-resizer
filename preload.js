/* add these here so we can pass it to the renderer */
const os = require("os");
const path = require("path");

/* https://www.electronjs.org/docs/latest/api/context-bridge */
const { contextBridge } = require("electron");
/*
  Preload scripts are injected before a web page loads in the renderer,
  similar to a Chrome extension's content scripts.
  To add features to your renderer that require privileged access,
  you can define global objects through the contextBridge API.
*/
contextBridge.exposeInMainWorld("os", {
  homedir: () => os.homedir(),
});

contextBridge.exposeInMainWorld("path", {
  join: (...args) => path.join(...args),
});
