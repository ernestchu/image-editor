const path = require('path')
const { app, Menu, BrowserWindow } = require('electron')
const createMenuTemplate = require('./menu.js')
require('./states.js')

function createWindow () {
  const win = new BrowserWindow({
    width: 1480,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  Menu.setApplicationMenu(Menu.buildFromTemplate(createMenuTemplate(win)))
  // win.webContents.setVisualZoomLevelLimits(1, 3)

  win.loadFile(path.join(__dirname, 'index.html'))
  win.webContents.openDevTools()
}

app.on('window-all-closed', () => {
  app.quit()
})

app.whenReady().then(() => {
  createWindow()
})
