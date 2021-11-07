const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('file', {
  // open: () => ipcRenderer.invoke('file:open'),
  open: handler => {
    ipcRenderer.on('FILE_OPEN', (_, args) => handler(args))
  }
})

contextBridge.exposeInMainWorld('view', {
  RGBDecomposition: handler => {
    ipcRenderer.on('RGB_DECOMP', () => handler())
  },
  HSIDecomposition: handler => {
    ipcRenderer.on('HSI_DECOMP', () => handler())
  }
})

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }

})
