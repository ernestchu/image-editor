function drawCirc () {
  const oldCanvas = document.getElementById('original-image')
  // clear all previous added listeners
  const canvas = oldCanvas.cloneNode(true)
  oldCanvas.parentNode.replaceChild(canvas, oldCanvas)
  const ctx = canvas.getContext('2d')
  const circs = []

  // When true, moving the mouse draws on the canvas
  let isDrawing = false;
  let x = 0;
  let y = 0;

  canvas.addEventListener('mousedown', e => {
    x = e.offsetX
    y = e.offsetY
    isDrawing = true
  })

  canvas.addEventListener('mousemove', e => {
    if (isDrawing === true) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawPrevCircs()
      drawCirc(x, y, e.offsetX, e.offsetY)
    }
  })

  canvas.addEventListener('mouseup', e => {
    if (isDrawing === true) {
      circs.push([x, y, e.offsetX, e.offsetY])
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawPrevCircs()
      isDrawing = false
    }
  })

  function drawPrevCircs () {
    circs.forEach(el => drawCirc(...el)) 
  }
  
  function drawCirc(x1, y1, x2, y2) {
    const stroke = 2
    const radius = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))

    // const steps  = 2 * Math.PI * radius
    // const stepLen = 360 / 180 * Math.PI / steps
    const stepLen = 1 / radius // in rad

    const centerX = Math.round((x1 + x2) / 2)
    const centerY = Math.round((y1 + y2) / 2)

    for (let theta = 0; theta < 2 * Math.PI; theta += stepLen) {
      const x = (x1-centerX) * Math.cos(theta) - (y1-centerY) * Math.sin(theta) + centerX
      const y = (x1-centerX) * Math.sin(theta) + (y1-centerY) * Math.cos(theta) + centerY
      ctx.fillRect(
        Math.round(x),
        Math.round(y),
        stroke, stroke
      )
    }
  }

  showOnlyDiv('draw')
}
