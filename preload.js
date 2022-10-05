/* https://www.electronjs.org/do */
const { contextBridge } = require("electron");

/*
  Preload scripts are injected before a web page loads in the renderer,
  similar to a Chrome extension's content scripts.
  To add features to your renderer that require privileged access,
  you can define global objects through the contextBridge API.
*/
contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
});
