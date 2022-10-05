/* add these here so we can pass it to the renderer */
const os = require("os");
const path = require("path");

/*
  https://www.electronjs.org/docs/latest/api/context-bridge
  https://www.electronjs.org/docs/latest/api/ipc-renderer
*/
const { contextBridge, ipcRenderer } = require("electron");
const Toastify = require("toastify-js");

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

contextBridge.exposeInMainWorld("Toastify", {
  toast: (options) => Toastify(options).showToast(),
});

contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args)),
});
