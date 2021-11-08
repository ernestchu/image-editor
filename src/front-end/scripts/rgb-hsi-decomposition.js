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

  const draw = (newData, n, targetCtx) => {
    const newImageData = new ImageData(newData, imageData.width, imageData.height)

    tempCtx.putImageData(newImageData, 0, 0)

    const newImg = new Image
    newImg.src = tempCanvas.toDataURL('image/png', 1.0)
    newImg.onload = () => {
      targetCtx.drawImage(
        newImg,
        0 + n * HSICanvas.width / 3, 0,
        HSICanvas.width / 3, HSICanvas.height)
    }
  }

  // %%%%%%%%%%%%%%%% RGB Decomposition %%%%%%%%%%%%%%%%%

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
    
    draw(newData, plane, RGBCtx)
  }

  document.getElementById('rgb-title').innerText = 'RGB Decomposition'

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  // %%%%%%%%%%%%%%%% HSI Decomposition %%%%%%%%%%%%%%%%%
  const HSICanvas = document.getElementById("hsi-images")
  const HSICtx = HSICanvas.getContext('2d')

  HSICanvas.width = 700
  HSICanvas.height = img.naturalHeight / img.naturalWidth * 700 / 3

  // hue component
  const hueData = Float32Array.from(imageData.data).map(el => { return el/255 })
  for (let i = 0; i < hueData.length; i+=4) {
    const r = hueData[i]
    const g = hueData[i + 1]
    const b = hueData[i + 2]

    const numerator = (r - g + r - b) / 2
    const denominator = Math.sqrt((r - g) * (r - g) + (r - b) * (g - b))
    const theta = Math.acos(numerator / denominator)

    if (b <= g) {
      hueData[i] = theta
    } else {
      hueData[i] = 2 * Math.PI - theta
    }
  }

  // now we have got the hue component, but we want to visualize it in colors.
  // So we set the saturation and intensity to halves and convert back to RGB.

  const colorfulHueData = new Uint8ClampedArray(imageData.data.length)
  for (let i = 0; i < hueData.length; i+=4) {
    let hue = hueData[i]
    const r = 0, g = 1, b = 2, a = 3
    const c = 0.5
    let first, second, third
    if (hue < 120 / 180 * Math.PI ) {
      // RG sector
      first  = b
      second = r
      third  = g
    } else if (hue < 240 / 180 * Math.PI) {
      // GB sector
      hue -= 120 / 180 * Math.PI
      first  = r
      second = g
      third  = b
    } else {
      // BR sector
      hue -= 240 / 180 * Math.PI
      first  = g
      second = b
      third  = r
    }
    colorfulHueData[i + first ] = ( c * (1 - c)                                                        ) * 255
    colorfulHueData[i + second] = ( c * (1 + (c * Math.cos(hue) / Math.cos(Math.PI / 3 - hue)))        ) * 255
    colorfulHueData[i + third ] = ( 3 * c - (colorfulHueData[i + first] + colorfulHueData[i + second]) ) * 255
    colorfulHueData[i + a] = 255
  }
  draw(colorfulHueData, 0, HSICtx)

  // saturation component
  const saturationData = new Uint8ClampedArray(imageData.data)
  for (let i = 0; i < saturationData.length; i+=4) {
    let sum = 0
    let min = saturationData[i]
    for (let j = 0; j < 3; j++) {
      sum += saturationData[i + j]
      if (min > saturationData[i + j]) {
        min = saturationData[i + j]
      }
    }
    const S = 255 - (3 / sum * 255) * min
    for (let j = 0; j < 3; j++) {
      saturationData[i + j] = S
    }
  }
  draw(saturationData, 1, HSICtx)

  // intensity component
  const intensityData = new Uint8ClampedArray(imageData.data)
  for (let i = 0; i < intensityData.length; i+=4) {
    let mean = 0
    for (let j = 0; j < 3; j++) {
      mean += intensityData[i + j] / 3
    }
    for (let j = 0; j < 3; j++) {
      intensityData[i + j] = mean
    }
  }
  draw(intensityData, 2, HSICtx)

  document.getElementById('hsi-title').innerText = 'HSI Decomposition'


  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  


}
