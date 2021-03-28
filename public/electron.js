const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const { ipcMain, Tray, Menu, dialog, remote } = electron;

let mainWindow;
let printWindow;
let appIcon;

let iconPath = path.join(__dirname, "logo192.png");

function createWindow() {
  let display = electron.screen.getPrimaryDisplay();
  let widthScreen = display.bounds.width;
  let heightScreen = display.bounds.height;

  mainWindow = new BrowserWindow({
    width: 300,
    height: 150,
    x: widthScreen - 300,
    y: heightScreen - 200, // heightScreen - 50
    // show: false,
    // frame: false,
    fullscreenable: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // mainWindow.webContents.openDevTools();

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));

  //print
  printWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
      // preload: __dirname + '/preload.js'
    },
  });

  printWindow.loadURL(
    isDev
      ? `file://${path.join(__dirname, "../public/printWindow.html")}`
      : `file://${path.join(__dirname, "../build/printWindow.html")}`
  );

  printWindow.hide();

  printWindow.on("closed", () => {
    printWindow = undefined;
  });

  mainWindow.webContents.openDevTools({ mode: "detach" });

  //icon in menu
  var contextMenu = Menu.buildFromTemplate([
    {
      label: "Open",
      click: function () {
        mainWindow.show();
      },
    },
    {
      label: "Quit",
      click: function () {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  appIcon = new Tray(iconPath);
  appIcon.setToolTip("ACEXIS | ORC TOOLS");
  appIcon.setContextMenu(contextMenu);

  mainWindow.on("minimize", function (event) {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.setMaximizable(false);

  appIcon.on("double-click", function (event) {
    mainWindow.show();
  });
}

ipcMain.on("print", (event, content) => {
  if (printWindow) {
    console.log("print 1");

    printWindow.webContents.send("print", content);
  }
});

ipcMain.on("readyToPrint", (event) => {
  console.log("readyToPrint");
  const getList = printWindow.webContents.getPrinters();
  console.log("getList",getList);
  try {
    if (printWindow) {
      setTimeout(() => {
        printWindow.webContents.print(
          {},
          // { silent: true },
          (success, errorType) => {
            if (!success) {
              dialog.showMessageBox({
                title: "Lỗi",
                message: !errorType ? "không tìm thấy máy in" : errorType,
              });
            }
          }
        );
      }, 1000);
    }
  } catch (error) {
    console.log(error);
    dialog.showMessageBox({
      title: "Lỗi",
      message: error.toString(),
    });
  }
});

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null && appIcon === null) {
    createWindow();
  }
});
