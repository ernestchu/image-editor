document.getElementById('open-file').addEventListener('click', async () => {
  const filename = await window.file.open()
  if (filename) {
    document.getElementById('filename').innerText = filename
    const canvas = document.getElementById('original-image')
    const ctx = canvas.getContext('2d')
    const img = new Image
    img.src = filename
    img.onload = () => {
      canvas.width = 400
      canvas.height = img.naturalHeight / img.naturalWidth * 400
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      console.log(
        ctx.getImageData(0, 0, canvas.width, canvas.height).data
      )
    }
  }
})

const titleWorker = new Worker('./workers/title.js')

titleWorker.onmessage = event => {
  console.log('worker: ', event.data)
  document.querySelector('h1').innerHTML = event.data

  titleWorker.terminate()
}

titleWorker.onerror = event => {
  console.log(event.message, event)
}
