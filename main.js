const path = require("path");
const { app, BrowserWindow, Menu } = require("electron");

const isDev = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";

function createMainWindow() {
  /*
    instance main browser window
    https://www.electronjs.org/docs/latest/api/browser-window
  */
  const mainWindow = new BrowserWindow({
    height: 360,
    title: "Image Resizer",
    width: isDev ? 1280 : 640,
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

/* Instance About window */
function createAboutWindow() {
  const aboutWindow = new BrowserWindow({
    height: 320,
    title: "About Image Resizer",
    width: isDev ? 640 : 320,
    x: 0,
    y: 0,
  });

  /* load render/front end */
  aboutWindow.loadFile(path.join(__dirname, "./renderer/about.html"));
}

/* https://www.electronjs.org/docs/latest/api/app */
app.whenReady().then(() => {
  createMainWindow();

  /* https://www.electronjs.org/docs/latest/api/menu */
  /* add menu */
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  // Open a window if none are open (macOS)
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

/* menu (toolbar) */
const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: "About",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  {
    role: "fileMenu",
  },
  ...(!isMac
    ? [
        {
          label: "Help",
          submenu: [
            {
              label: "About",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
];

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
