async function RGBHSIDecomposition () {

  // %%%%%%%%%%%%%%%%%% Restore state %%%%%%%%%%%%%%%%%%
  
  const { imageURL } = await window.state.getImageState()
  
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
  imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  const RGBCanvas = document.getElementById("rgb-images")
  const RGBCtx = RGBCanvas.getContext('2d')

  RGBCanvas.width = 700
  RGBCanvas.height = img.naturalHeight / img.naturalWidth * 700 / 3

  for (let plane = 0; plane < 3; plane++) {
    const newData = new Uint8ClampedArray(imageData.data)
    for (let i = 0; i < newData.length; i+=4) {
      for (let j = 0; j < 3; j++) {
        if (j != plane) {
          newData[i + j] = 0
        }
      }
    }

    const newImageData = new ImageData(newData, imageData.width, imageData.height)

    tempCtx.putImageData(newImageData, 0, 0)

    const newImg = new Image
    newImg.src = tempCanvas.toDataURL('image/png', 1.0)
    newImg.onload = () => {
      RGBCtx.drawImage(
        newImg,
        0 + plane * RGBCanvas.width / 3, 0,
        RGBCanvas.width / 3, RGBCanvas.height)
    }
  }


  


}
