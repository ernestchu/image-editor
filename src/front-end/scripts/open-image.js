function openImage (image) {
  const canvasWidth = 600
  if (image) {
    document.getElementById("rgb-hsi-decomposition").style.display = 'none'

    const { filename, data, width, height } = image;
    document.getElementById('filename').innerText = filename
    const imageData = new ImageData(data, width, height)

    const tempCanvas = document.createElement("canvas")
    const tempCtx = tempCanvas.getContext('2d')

    tempCanvas.width  = imageData.width
    tempCanvas.height = imageData.height
    tempCtx.putImageData(imageData, 0, 0)

    const canvas = document.getElementById('original-image')
    const ctx = canvas.getContext('2d')
    const img = new Image
    imageURL = tempCanvas.toDataURL('image/png', 1.0)
    img.src = imageURL
    img.onload = () => {
      canvas.width = canvasWidth
      canvas.height = img.naturalHeight / img.naturalWidth * canvasWidth
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }

    window.state.updateImageState(imageURL, true)
  }
}
