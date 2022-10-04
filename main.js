const path = require("path");
const { app, BrowserWindow } = require("electron");

function createMainWindow() {
  /* instance main browser window */
  const mainWindow = new BrowserWindow({
    title: "Image Resizer",
    width: 640,
    height: 360,
  });

  /* load render/front end */
  mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
}

app.whenReady().then(() => {
  createMainWindow();
});
