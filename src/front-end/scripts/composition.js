function composition (image) {
  const canvasWidth = 600
  let compImageData
  if (image) {
    const { data, width, height } = image;
    compImageData = new ImageData(data, width, height)
    document.getElementById('composition-alpha').addEventListener('input', enableComposition)
    enableComposition({
      target: document.getElementById('composition-alpha')
    })

    showOnlyDiv('composition')
  }

  async function enableComposition (event) {
    const mode = document.querySelector('input[name="composition-mode"]:checked').value
    const alpha = event.target.value

    // %%%%%%%%%%%%%%%%%% Restore state %%%%%%%%%%%%%%%%%%
    let { imageURL } = await window.state.getImageState()
    let img
    let imageLoadPromise = new Promise(resolve => {
      img = new Image
      img.onload = resolve
      img.src = imageURL
    })
    await imageLoadPromise

    const tempCanvas = document.createElement("canvas")
    const tempCtx = tempCanvas.getContext('2d')

    tempCanvas.width  = canvasWidth
    tempCanvas.height = img.naturalHeight / img.naturalWidth * canvasWidth
    tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height)
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    tempCanvas.width  = compImageData.width
    tempCanvas.height = compImageData.height
    tempCtx.putImageData(compImageData, 0, 0)
    imageURL = tempCanvas.toDataURL('image/png', 1.0)
    imageLoadPromise = new Promise(resolve => {
      img = new Image
      img.onload = resolve
      img.src = imageURL
    })
    await imageLoadPromise

    tempCanvas.width  = canvasWidth
    tempCanvas.height = img.naturalHeight / img.naturalWidth * canvasWidth
    tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height)
    compImageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)

    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    
    const composedData = new Uint8ClampedArray(Math.max(imageData.data.length, compImageData.data.length))
    const width = canvasWidth
    const height = Math.max(imageData.height, compImageData.height)
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        for (let k = 0; k < 4; k++) {
          let px
          if (j >= imageData.height) {
            px = compImageData.data[i * 4 + j * width * 4 + k]
          }
          else if (j >= compImageData.height) {
            px = imageData.data[i * 4 + j * width * 4 + k]
          }
          else {
            px = (
              imageData.data[i * 4 + j * width * 4 + k] * alpha +
              compImageData.data[i * 4 + j * width * 4 + k] * (1 - alpha)
            )
          }
          composedData[i * 4 + j * width * 4 + k] = px
        }
      }
    }
    const composedImageData = new ImageData(composedData, width, height)

    tempCanvas.width = composedImageData.width
    tempCanvas.height = composedImageData.height
    tempCtx.putImageData(composedImageData, 0, 0)

    const canvas = document.getElementById('original-image')
    const ctx = canvas.getContext('2d')
    img = new Image
    img.src = tempCanvas.toDataURL('image/png', 1.0)
    img.onload = () => {
      canvas.width = canvasWidth
      canvas.height = img.naturalHeight / img.naturalWidth * canvasWidth
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
  }
}
