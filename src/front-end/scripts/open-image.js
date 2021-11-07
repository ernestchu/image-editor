const imageWorker = new Worker('./workers/image.js')

imageWorker.onmessage = event => {
  const { data, width, height } = event.data;
  const imageData = new ImageData(data, width, height)

  const tempCanvas = document.createElement("canvas")
  const tempCtx = tempCanvas.getContext('2d')

  tempCanvas.width  = imageData.width
  tempCanvas.height = imageData.height
  tempCtx.putImageData(imageData, 0, 0)

  const canvas = document.getElementById('original-image')
  const ctx = canvas.getContext('2d')
  const img = new Image
  img.src = tempCanvas.toDataURL()
  img.onload = () => {
    canvas.width = 400
    canvas.height = img.naturalHeight / img.naturalWidth * 400
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }

  // imageWorker.terminate()
}

imageWorker.onerror = event => {
  console.log(event.message, event)
}

function openImage (filename) {
  if (filename) {
    document.getElementById('filename').innerText = filename
    imageWorker.postMessage(filename)
  }
}

// document.getElementById('open-file').addEventListener('click', async () => {
//   const filename = await window.file.open()
//   if (filename) {
//     document.getElementById('filename').innerText = filename
// 
//     imageWorker.postMessage(filename)
//     // const canvas = document.getElementById('original-image')
//     // const ctx = canvas.getContext('2d')
//     // const img = new Image
//     // img.src = filename
//     // img.onload = () => {
//     //   canvas.width = 400
//     //   canvas.height = img.naturalHeight / img.naturalWidth * 400
//     //   ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
//     //   console.log(
//     //     ctx.getImageData(0, 0, canvas.width, canvas.height).data
//     //   )
//     // }
//   }
// })


