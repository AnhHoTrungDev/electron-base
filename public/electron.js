const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const { ipcMain, Tray, Menu, dialog, remote, Notification } = electron;

const showNotification = (config) => {
  const { title = "print app", body = "from print app.." } = config;
  const notification = {
    title,
    body,
    ...config,
  };
  new Notification(notification).show();
};

let mainWindow;
let printWindow;
let appIcon;

let iconPath = path.join(__dirname, "logo192.png");

function createWindow() {
  showNotification({
    title: "Print đang khởi chạy",
    body: "Trong quá trình chạy...",
  });
  let display = electron.screen.getPrimaryDisplay();
  let widthScreen = display.bounds.width;
  let heightScreen = display.bounds.height;

  mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    // x: widthScreen - 300,
    // y: heightScreen - 200, // heightScreen - 50
    // show: false,
    // frame: false,
    fullscreenable: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  // mainWindow.webContents.openDevTools();

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
  // mainWindow.hide();

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
  appIcon.setToolTip("ACEXIS | Print");
  appIcon.setContextMenu(contextMenu);

  mainWindow.on("minimize", function (event) {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.setMaximizable(false);
  mainWindow.on("close", async function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  appIcon.on("double-click", function () {
    mainWindow.show();
  });
}

ipcMain.on("main-window-ready", async (event) => {
  const listOfPrint = await mainWindow.webContents.getPrinters();
  console.log("listOfPrint :>> ", listOfPrint);
  event.sender.send("get-print-driver", listOfPrint);
});
// get  list print driver

ipcMain.on("list-print-driver", async () => {
  const listOfPrint = mainWindow.webContents.getPrinters();
  mainWindow.webContents.send(listOfPrint);
  // console.log('listOfPrint :>> ', listOfPrint);
  // return listOfPrint
  // mainWindow.webContents.send("""aaaa");
});

//notification
ipcMain.on("send-notification", (_, content) => {
  showNotification(content);
});

// send content to print screen
ipcMain.on("print", (event, content) => {
  if (printWindow) {
    console.log("print 1");
    printWindow.webContents.send("print", content);
  }
});

// print here
ipcMain.on("readyToPrint", (event, content) => {
  try {
    if (printWindow) {
      setTimeout(() => {
        printWindow.webContents.print(
          { deviceName: content, silent: true },
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
