function drawRect () {
  const oldCanvas = document.getElementById('original-image')
  // clear all previous added listeners
  const canvas = oldCanvas.cloneNode(true)
  oldCanvas.parentNode.replaceChild(canvas, oldCanvas)
  const ctx = canvas.getContext('2d')
  const rects = []

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
      drawPrevRects()
      drawRect(x, y, e.offsetX, e.offsetY)
    }
  })

  canvas.addEventListener('mouseup', e => {
    if (isDrawing === true) {
      rects.push([x, y, e.offsetX, e.offsetY])
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawPrevRects()
      isDrawing = false
    }
  })

  function drawPrevRects () {
    rects.forEach(el => drawRect(...el)) 
  }
  
  function drawRect(x1, y1, x2, y2) {
    drawLine(x1, y1, x2, y1)
    drawLine(x2, y1, x2, y2)
    drawLine(x2, y2, x1, y2)
    drawLine(x1, y2, x1, y1)
  }

  function drawLine(x1, y1, x2, y2) {
    const stroke = 2
    const distX = Math.abs(x1 - x2)
    const distY = Math.abs(y1 - y2)
    const steps = Math.max(distX, distY)

    const stepLenX = (x2 - x1) / steps
    const stepLenY = (y2 - y1) / steps

    let pathX = x1, pathY = y1
    for (let i = 0; i < steps; i ++) {
      ctx.fillRect(
        Math.round(pathX + stepLenX * i),
        Math.round(pathY + stepLenY * i),
        stroke, stroke
      )
    }
  }
  

  showOnlyDiv('draw')
}
