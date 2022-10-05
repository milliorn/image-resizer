const fs = require("fs");
const os = require("os");
const path = require("path");
const resizeImg = require("resize-img");

const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");

const isDev = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";

let mainWindow;

function createMainWindow() {
  /*
    instance main browser window
    https://www.electronjs.org/docs/latest/api/browser-window
  */
  mainWindow = new BrowserWindow({
    height: 360,
    title: "Image Resizer",
    width: isDev ? 1280 : 640,
    x: 0,
    y: 0,
    webPreferences: {
      /* used for preload.js */
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
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

  /* remove mainWindow onclose */
  mainWindow.on("closed", () => (mainWindow = null));

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

/* respond to ipcRender resize event */
ipcMain.on("image:resize", (e, options) => {
  // console.log(options);
  options.dest = path.join(os.homedir(), "image-resizer");
  resizeImage(options);
});

/* resize and save image */
async function resizeImage({ imgPath, height, width, dest }) {
  try {
    console.log(imgPath, height, width, dest);

    /* resize image */
    const newPath = await resizeImg(fs.readFileSync(imgPath), {
      width: +width,
      height: +height,
    });

    const filename = path.basename(imgPath);

    /* create destination folder */
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }

    /* write to file to destination folder */
    fs.writeFileSync(path.join(dest, filename), newPath);

    /* send to renderer */
    mainWindow.webContents.send("image:done");

    /* open the folder in explorer */
    shell.openPath(dest);
  } catch (error) {
    console.log(error);
  }
}
