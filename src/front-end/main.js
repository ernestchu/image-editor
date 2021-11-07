const path = require('path')
const { app, Menu, BrowserWindow/* , ipcMain, dialog */ } = require('electron')
const createMenuTemplate = require('./templates/menu.js')

function createWindow () {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  })
  Menu.setApplicationMenu(Menu.buildFromTemplate(createMenuTemplate(win)))

  win.loadFile(path.join(__dirname, 'index.html'))
  win.webContents.openDevTools()

  // ipcMain.handle('file:open', () => {
  //   const filename = dialog.showOpenDialogSync({
  //     filters: [
  //       { name: 'Images', extensions: ['pcx'] }
  //     ],
  //     properties: ['openFile']
  //   })
  //   return filename ? filename[0] : null;
  // })
}

app.on('window-all-closed', () => {
  app.quit()
})

app.whenReady().then(() => {
  createWindow()
})
