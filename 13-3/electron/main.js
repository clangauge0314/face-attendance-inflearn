const { app, BrowserWindow, ipcMain, globalShortcut, nativeImage } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;

function createWindow() {
  let iconFileName;
  if (process.platform === 'win32') {
    iconFileName = "icon.ico";
  } else if (process.platform === 'darwin') {
    iconFileName = "icon.icns";
  } else {
    iconFileName = "icon.png";
  }

  let iconPath = path.join(__dirname, iconFileName);

  if (!fs.existsSync(iconPath)) {
    iconPath = path.join(__dirname, "icon.png");
  }

  if (process.platform === 'darwin' && fs.existsSync(iconPath)) {
    try {
      const dockIcon = nativeImage.createFromPath(iconPath);
      app.dock.setIcon(dockIcon);
    } catch (err) {
      console.error(err);
    }
  }

  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1400,
    minHeight: 900,
    frame: false,
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 16, y: 18 },
    backgroundColor: "#000000",
    title: "Face-Based Access Management System",
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      webSecurity: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.setName("Face-Based Access Management System");

app.whenReady().then(() => {
  createWindow();

  const adminShortcut =
    process.platform === "darwin" ? "Command+Shift+A" : "Control+Shift+A";

  const ret = globalShortcut.register(adminShortcut, () => {
    if (mainWindow) {
      mainWindow.webContents.send("navigate-to-admin");
    }
  });

  if (!ret) {
    console.log("Admin shortcut registration failed");
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.on("window:minimize", () => mainWindow?.minimize());
ipcMain.on("window:maximize", () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});
ipcMain.on("window:close", () => mainWindow?.close());