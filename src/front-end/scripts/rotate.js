function rotate () {
  window.state.getImageState()
    .then(({ isOpened }) => {
      if (isOpened) {
        const degEl = document.getElementById('rotate-deg')
        document.getElementById('rotate-deg-indicator').innerText = degEl.value
        degEl.addEventListener('input', enableRotate)

        showOnlyDiv('rotate')
      } else {
        window.main.showErrorBox('Error', 'You must open an image first to use this functionality.')
      }
    })
    .catch(e => {
      console.log(e)
    })

  async function enableRotate (event) {
    const deg = event.target.value
    document.getElementById('rotate-deg-indicator').innerText = deg
    const canvasWidth = 600

    const { imageURL } = await window.state.getImageState()

    // %%%%%%%%%%%%%%%%%% Restore state %%%%%%%%%%%%%%%%%%
    //
    let img
    const imageLoadPromise = new Promise(resolve => {
      img = new Image
      img.onload = resolve
      img.src = imageURL
    })
    await imageLoadPromise

    const tempCanvas = document.createElement("canvas")
    const tempCtx = tempCanvas.getContext('2d')

    tempCanvas.width  = img.naturalWidth
    tempCanvas.height = img.naturalHeight
    tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height)
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)

    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    
    const width = imageData.width
    const height = imageData.height
    const rotatedData = new Uint8ClampedArray(imageData.data.length)

    const rad = deg / 180 * Math.PI

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        for (let k = 0; k < 4; k++) {
          const shiftedI = i - Math.round(width / 2)
          const shiftedJ = j - Math.round(height / 2)
          let rotatedI = Math.round(shiftedI * Math.cos(-rad) - shiftedJ * Math.sin(-rad))
          let rotatedJ = Math.round(shiftedI * Math.sin(-rad) + shiftedJ * Math.cos(-rad))
          rotatedI += Math.round(width / 2)
          rotatedJ += Math.round(height / 2)
          rotatedData[i * 4 + j * width * 4 + k] = (
            rotatedI < width  && rotatedI >= 0 &&
            rotatedJ < height && rotatedJ >= 0
          )
            ? imageData.data[rotatedI * 4 + rotatedJ * width * 4 + k]
            : 255
        }
      }
    }
    const rotatedImageData = new ImageData(rotatedData, width, height)

    tempCtx.putImageData(rotatedImageData, 0, 0)

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
