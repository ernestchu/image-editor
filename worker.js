var addon = require('./build.nosync/Release/image-editor.node')
const result = addon.hello()

console.log(result)

postMessage(result)
