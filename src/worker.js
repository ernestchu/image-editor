const backEnd = require('../build.nosync/Release/image-editor.node')
const result = backEnd.title()

console.log(result)

postMessage(result)
