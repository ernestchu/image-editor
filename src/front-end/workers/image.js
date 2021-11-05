const backEnd = require('../../../build.nosync/Release/image-editor.node')


onmessage = e => {
  const result = backEnd.image(e.data[0])
  postMessage(result)
}
