const fs = require('fs')
const path = require('path')

exports.getFiles = function getFiles (dir) {
  const files = fs.readdirSync(dir)
  return files.map(file => path.join(dir, file))
}