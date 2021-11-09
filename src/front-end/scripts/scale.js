function abs2D (x1, y1, x2, y2) {
  return Math.sqrt(
    Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)
  )
}

const interpolate = {
  'nearest-neighbor': (imageData, scale, canvasWidth, offsetX, offsetY) => {
    const width = imageData.width
    const height = imageData.height
    const canvasHeight = canvasWidth / width * height
    offsetX = Math.round(offsetX / canvasWidth * width)
    offsetY = Math.round(offsetY / canvasHeight * height)

    // TODO: shift based on offsets

    const scaledData = new Uint8ClampedArray(imageData.data.length)

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        for (let k = 0; k < 4; k++) {
          const scaledI = Math.round(i * scale)
          const scaledJ = Math.round(j * scale)
          scaledData[i * 4 + j * width * 4 + k] = (
            scaledI < width  && scaledI >= 0 &&
            scaledJ < height && scaledJ >= 0
          )
            ? imageData.data[scaledI * 4 + scaledJ * width * 4 + k]
            : 255
        }
      }
    }
    return new ImageData(scaledData, width, height)
  },
  'bilinear': (imageData, scale, canvasWidth, offsetX, offsetY) => {
    const scaledData = new Uint8ClampedArray(imageData.data.length)
    
    const width = imageData.width
    const height = imageData.height
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        for (let k = 0; k < 4; k++) {
          const scaledI  = i * scale
          const scaledJ  = j * scale
          const scaledCeilI  = Math.ceil (i * scale)
          const scaledCeilJ  = Math.ceil (j * scale)
          const scaledFloorI = Math.floor(i * scale)
          const scaledFloorJ = Math.floor(j * scale)
          
          const dists = [
            abs2D(scaledI, scaledJ, scaledFloorI, scaledFloorJ),
            abs2D(scaledI, scaledJ, scaledFloorI, scaledCeilJ),
            abs2D(scaledI, scaledJ, scaledCeilI , scaledFloorJ),
            abs2D(scaledI, scaledJ, scaledFloorI, scaledFloorJ)
          ]
          let distTotal = 0
          dists.forEach(el => distTotal += el)

          scaledData[i * 4 + j * width * 4 + k] = (
            scaledCeilI < width  && scaledFloorI >= 0 &&
            scaledCeilJ < height && scaledFloorJ >= 0
          )
            ? (
              imageData.data[scaledFloorI * 4 + scaledFloorJ * width * 4 + k] * dists[0] / distTotal +
              imageData.data[scaledFloorI * 4 + scaledCeilJ  * width * 4 + k] * dists[1] / distTotal +
              imageData.data[scaledCeilI  * 4 + scaledFloorJ * width * 4 + k] * dists[2] / distTotal +
              imageData.data[scaledCeilI  * 4 + scaledCeilJ  * width * 4 + k] * dists[3] / distTotal
            )
            : 255
        }
      }
    }
    return new ImageData(scaledData, width, height)
  }
}

async function canvasEnableScale (event) {
  const canvasWidth = 600
  event.preventDefault()

  const { imageURL, isOpened, scale } = await window.state.getImageState()
  if (!isOpened) {
    return
  }

  const { deltaY, offsetX, offsetY } = event
  const mode = document.querySelector('input[name="scale"]:checked').value

  let newScale = scale + 0.01 * Math.round(deltaY)
  newScale = (newScale > 10) ? 10 : newScale
  newScale = (newScale < 0.1) ? 0.1 : newScale
  window.state.updateImageScale(newScale)

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
  const scaledImageData = interpolate[mode](imageData, newScale, canvasWidth, offsetX, offsetY)
  tempCtx.putImageData(scaledImageData, 0, 0)

  const canvas = event.target 
  const ctx = canvas.getContext('2d')
  img = new Image
  img.src = tempCanvas.toDataURL('image/png', 1.0)
  img.onload = () => {
    canvas.width = canvasWidth
    canvas.height = img.naturalHeight / img.naturalWidth * canvasWidth
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }


}

function scale () {
  const canvas = document.getElementById('original-image')
  canvas.addEventListener('wheel', canvasEnableScale)

  showOnlyDiv('scale')
}
