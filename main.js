const path = require("path");
const { app, BrowserWindow, Menu } = require("electron");

const isDev = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";

function createMainWindow() {
  /* instance main browser window */
  const mainWindow = new BrowserWindow({
    title: "Image Resizer",
    width: isDev ? 1280 : 640,
    height: 360,
    x: 0,
    y: 0,
  });

  // open devtools if in dev
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  /* load render/front end */
  mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
}

app.whenReady().then(() => {
  createMainWindow();

  /* add menu */
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  // Open a window if none are open (macOS)
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

/* menu */
const menu = [
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        click: () => app.quit(),
        accelerator: "CmdOrCtrl+W", // shortcut to Quit
      },
    ],
  },
];

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});
