const { contextBridge, ipcRenderer } = require('electron')
const backEnd = require('../../build.nosync/Release/image-editor.node')

contextBridge.exposeInMainWorld('title', {
  text: backEnd.title()
})

contextBridge.exposeInMainWorld('file', {
  open: handler => ipcRenderer.on('FILE_OPEN', (_, image) => handler(image))
})

contextBridge.exposeInMainWorld('edit', {
  drawRect: handler => ipcRenderer.on('DRAW_RECT', () => handler()),
  drawCirc: handler => ipcRenderer.on('DRAW_CIRC', () => handler()),
  drawLine: handler => ipcRenderer.on('DRAW_LINE', () => handler()),
  drawFree: handler => ipcRenderer.on('DRAW_FREE', () => handler())
})

contextBridge.exposeInMainWorld('view', {
  RGBHSIDecomposition: handler => ipcRenderer.on('RGB_HSI_DECOMP', () => handler()),
  scale: handler => ipcRenderer.on('SCALE', () => handler()),
  rotate: handler => ipcRenderer.on('ROTATE', () => handler())
})

contextBridge.exposeInMainWorld('state', {
  updateImageState: (imageURL, isOpened) => ipcRenderer.invoke('update-image-state', imageURL, isOpened),
  updateImageScale: (scale) => ipcRenderer.invoke('update-image-scale', scale),
  getImageState: () => {
    return ipcRenderer.invoke('get-image-state')
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
