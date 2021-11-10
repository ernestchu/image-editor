// Source:
// https://github.com/electron/electron/blob/888ac65c72df227ed4d65d9177748d4082b13b0f/lib/browser/api/menu-item-roles.ts

const { app, shell, dialog } = require('electron')
const backEnd = require('../../build.nosync/Release/image-editor.node')
const store = require('./states.js')

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
              'FILE_OPEN', backEnd.image(filename[0])
            )
          }
        }
      },
      { type: 'separator' },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  }

  const editMenu = {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      {
        label: 'Composition',
        accelerator: 'CmdOrCtrl+Shift+C',
        click: () => {
          const { isOpened } = store.getState()
          if (isOpened) {
            const filename = dialog.showOpenDialogSync({
              filters: [
                { name: 'Images', extensions: ['pcx'] }
              ],
              properties: ['openFile']
            })
            if (filename) {
              win.webContents.send(
                'COMP', backEnd.image(filename[0])
              )
            }
          } else {
            dialog.showErrorBox('Error', 'You must open an image first to use this functionality.')
          }
        }
      },
      {
        label: 'Draw',
        submenu: [
          { label: 'Rectangle', click: () => win.webContents.send('DRAW_RECT') },
          { label: 'Circle',    click: () => win.webContents.send('DRAW_CIRC') },
          { label: 'Line',      click: () => win.webContents.send('DRAW_LINE') },
          { label: 'Free',      click: () => win.webContents.send('DRAW_FREE') }
        ]
      },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  }

  const viewMenu = {
    label: 'View',
    submenu: [
      {
        label: 'RGB/HSI decomposition',
        accelerator: 'CmdOrCtrl+D',
        click: () => win.webContents.send('RGB_HSI_DECOMP')
      },
      {
        label: 'Scale',
        accelerator: 'CmdOrCtrl+Shift+S',
        click: () => win.webContents.send('SCALE')
      },
      {
        label: 'Rotate',
        accelerator: 'CmdOrCtrl+Shift+R',
        click: () => win.webContents.send('ROTATE')
      },
      { type: 'separator' },
      { role: 'reload' },
      // { role: 'forceReload' },
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
    ...(!!editMenu ? [editMenu] : [{ role: 'editMenu' }]),
    ...(!!viewMenu ? [viewMenu] : [{ role: 'viewMenu' }]),
    { role: 'windowMenu' },
    helpMenu
  ]

  return template
}
