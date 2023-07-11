const { app, BrowserWindow, globalShortcut, Menu} = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 78*6,
    height: 78*6,
    resizable: false,
    fullscreen: false,
    fullscreenable: false,
  })
  win.setContentSize(78*6, 78*6)
  win.loadFile('index.html')
  win.on('focus', () => {
    globalShortcut.register("CommandOrControl+0", () => { return });
    globalShortcut.register("CommandOrControl+plus", () => { return });
    globalShortcut.register("CommandOrControl+=", () => { return });
    globalShortcut.register("CommandOrControl+-", () => { return });
    globalShortcut.register("CommandOrControl+_", () => { return });
  });

  win.on('blur', () => {
    globalShortcut.unregister("CommandOrControl+0");
    globalShortcut.unregister("CommandOrControl+plus");
    globalShortcut.unregister("CommandOrControl+=");
    globalShortcut.unregister("CommandOrControl+-");
    globalShortcut.unregister("CommandOrControl+_");
  });
}

app.commandLine.appendSwitch('disable-pinch');

const isMac = process.platform === 'darwin'
const customMenuTemplate = [
  ...(process.platform === 'darwin'
    ? [
        {
          label: app.name,
          submenu: [
            { role: 'quit' },
          ],
        },
      ]
    : []),
    // {
    //   label: 'View',
    //   submenu: [
    //     { role: 'toggleDevTools' },
    //   ]
    // },
];

const menu = Menu.buildFromTemplate(customMenuTemplate)
Menu.setApplicationMenu(menu)



app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})