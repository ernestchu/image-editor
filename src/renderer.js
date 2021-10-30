document.getElementById('open-file').addEventListener('click', async () => {
  await window.file.open()
})

const worker = new Worker('./worker.js')

worker.onmessage = event => {
  console.log('worker: ', event.data)
  document.querySelector('h1').innerHTML = event.data

  worker.terminate()
}

worker.onerror = event => {
  console.log(event.message, event)
}
