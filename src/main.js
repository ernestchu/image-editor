const path = require('path')
const { app, BrowserWindow, ipcMain, dialog } = require('electron')

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

  win.loadFile(path.join(__dirname, 'index.html'))
  win.webContents.openDevTools()

  ipcMain.handle('file:open', () => {
    dialog.showOpenDialog( { properties: ['openFile'] })
      .then(res => {
        if (!res.canceled) {
          // handle fully qualified file name
          console.log(res.filePaths[0])
          return res.filePaths
        } else {
          console.log("no file selected")
        }
      })
      .catch(err => {
        console.log(err)
      })
  })
}

app.on('window-all-closed', () => {
  app.quit()
})

app.whenReady().then(() => {
  createWindow()
})
