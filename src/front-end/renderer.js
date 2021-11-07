// %%%%%%%%%%%% Validating C++ back-end %%%%%%%%%%%%
const titleWorker = new Worker('./workers/title.js')
titleWorker.onmessage = event => {
  // console.log('worker: ', event.data)
  document.querySelector('h1').innerHTML = event.data

  titleWorker.terminate()
}
titleWorker.onerror = event => {
  console.log(event.message, event)
}
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// menu item listener registration
window.file.open(filename => openImage(filename))

window.view.RGBDecomposition(() => openImage(filename))
window.view.HSIDecomposition(() => openImage(filename))
