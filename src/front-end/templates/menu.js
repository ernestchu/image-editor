// Source:
// https://github.com/electron/electron/blob/888ac65c72df227ed4d65d9177748d4082b13b0f/lib/browser/api/menu-item-roles.ts

const { app, shell, dialog } = require('electron')

const isMac = process.platform === 'darwin'

module.exports = win => {
  const helpMenu = {
    role: 'help',
    submenu: app.isPackaged ? [] : [
      {
        label: 'Learn More',
        click: async () => {
          await shell.openExternal('https://electronjs.org')
        }
      },
      {
        label: 'Documentation',
        click: async () => {
          const version = process.versions.electron
          await shell.openExternal(`https://github.com/electron/electron/tree/v${version}/docs#readme`)
        }
      },
      {
        label: 'Community Discussions',
        click: async () => {
          await shell.openExternal('https://discord.gg/electron')
        }
      },
      {
        label: 'Search Issues',
        click: async () => {
          await shell.openExternal('https://github.com/electron/electron/issues')
        }
      }
    ]
  };

  const fileMenu = {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click: () => {
          const filename = dialog.showOpenDialogSync({
            filters: [
              { name: 'Images', extensions: ['pcx'] }
            ],
            properties: ['openFile']
          })
          if (filename) {
            win.webContents.send(
              'FILE_OPEN', filename[0]
            )
          }
        }
      },
      { type: 'separator' },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  }

  const viewMenu = {
    label: 'View',
    submenu: [
      { label: 'RGB decomposition', click: () => win.webContents.send('RGB_DECOMP') },
      { label: 'HSI decomposition', click: () => win.webContents.send('HSI_DECOMP') },
      { type: 'separator' },
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  }

  const macAppMenu = { role: 'appMenu' }
  const template = [
    ...(isMac ? [macAppMenu] : []),
    ...(!!fileMenu ? [fileMenu] : [{ role: 'fileMenu' }]),
    { role: 'editMenu' },
    ...(!!viewMenu ? [viewMenu] : [{ role: 'viewMenu' }]),
    { role: 'windowMenu' },
    helpMenu
  ]

  return template
}
