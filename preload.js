window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }

  var worker = new Worker('./worker.js')

  worker.onmessage = event => {
    console.log('worker: ', event.data)
    document.querySelector('h1').innerHTML = event.data

    worker.terminate()
    worker = undefined
  }

  worker.onerror = event => {
    console.log(event.message, event)
  }
})
